/* ============================================
   DAILY BUILD - JavaScript Logic
   ============================================
   Yeh file poore app ka "dimaag" hai.
   Har function ke upar comment likha hai ki
   woh kya kaam karta hai.

   MAIN IDEA:
   1. Hum tasks ko ek ARRAY (list) mein store karte hain.
   2. Jab bhi kuch change hota hai (naya task, delete, done),
      hum us array ko browser ki "localStorage" mein save
      kar dete hain - taaki refresh karne pe bhi tasks na
      udd jaayein.
   3. Phir screen pe list dobara draw (render) kar dete hain.
*/

// ===== STEP 1: HTML elements ko pakadna (select karna) =====
// document.getElementById() se hum HTML ke kisi element ko
// JavaScript mein use karne ke liye pakadte hain.
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const filtersContainer = document.getElementById('filters');

const statTotal = document.getElementById('statTotal');
const statDone = document.getElementById('statDone');
const statPending = document.getElementById('statPending');

// ===== STEP 2: Data store karna =====
// "tasks" naam ka ek array banaya hai. Har task ek object hai
// jisme: id, text (task ka naam), priority, aur done (true/false) hai.
//
// localStorage.getItem('tasks') browser ki memory se purana
// data nikalta hai. Agar pehli baar khol rahe ho to kuch nahi
// milega, isliye "|| '[]'" likha hai (khaali array default).
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Abhi konsa filter active hai (all / pending / done)
let currentFilter = 'all';

// ===== STEP 3: Naya task add karna =====
// "submit" event tab chalta hai jab form submit hota hai
// (yaani jab user Enter dabaye ya "run" button click kare).
taskForm.addEventListener('submit', function (event) {
  // event.preventDefault() - form ko page reload karne se rokta hai
  event.preventDefault();

  // Input box mein jo text likha hai, usse nikal ke
  // trim() se aage-peeche ki extra spaces hata dete hain
  const text = taskInput.value.trim();

  // Agar user ne kuch likha hi nahi, to kuch mat karo
  if (text === '') return;

  // Naya task object banaya
  const newTask = {
    id: Date.now(),          // Date.now() se ek unique number milta hai (ID ke liye)
    text: text,               // jo user ne type kiya
    priority: priorityInput.value, // low / medium / high
    done: false                // naya task hamesha "pending" se start hota hai
  };

  // Naye task ko tasks array ke shuru mein daal do
  // (taaki naya task upar dikhe)
  tasks.unshift(newTask);

  // Input box ko khaali kar do agle task ke liye
  taskInput.value = '';

  // Data save karo aur screen update karo
  saveAndRender();
});

// ===== STEP 4: Task complete/pending toggle karna aur delete karna =====
// Hum yahan "event delegation" use kar rahe hain: poori list
// (taskList) pe ek hi click listener lagaya hai, individual
// buttons pe nahi. Jab bhi list ke andar kahin click hota hai,
// hum check karte hain ki kaunsa button dabaya gaya.
taskList.addEventListener('click', function (event) {
  // Sabse pehle: kya checkbox pe click hua?
  if (event.target.classList.contains('task-checkbox')) {
    // data-id attribute se pata chalta hai kaunsa task hai
    const id = Number(event.target.closest('.task-item').dataset.id);
    // us task ko dhoondo aur uska "done" status ulta (toggle) kar do
    const task = tasks.find(function (t) { return t.id === id; });
    if (task) task.done = !task.done;
    saveAndRender();
  }

  // Agar delete (x) button pe click hua
  if (event.target.classList.contains('delete-btn')) {
    const id = Number(event.target.closest('.task-item').dataset.id);
    // filter() se hum us task ko HATA ke baaki sab wapas rakh lete hain
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveAndRender();
  }
});

// ===== STEP 5: Filter tabs (All / Pending / Done) =====
filtersContainer.addEventListener('click', function (event) {
  if (!event.target.classList.contains('filter-btn')) return;

  // Saare buttons se "active" class hata do
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });
  // Jis button pe click hua usko "active" bana do
  event.target.classList.add('active');

  // data-filter attribute se pata chalta hai konsa filter chahiye
  currentFilter = event.target.dataset.filter;
  render();
});

// ===== STEP 6: Data ko localStorage mein save karna =====
function saveData() {
  // JSON.stringify() array ko text mein convert karta hai
  // taaki localStorage mein store ho sake
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ===== STEP 7: Screen pe tasks dikhana (render) =====
function render() {
  // Pehle current filter ke hisaab se tasks chuno
  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(function (t) { return !t.done; });
  } else if (currentFilter === 'done') {
    filteredTasks = tasks.filter(function (t) { return t.done; });
  }

  // Pehle list ko khaali karo, phir naye sirre se banao
  taskList.innerHTML = '';

  // Agar koi task nahi hai to "empty state" message dikhao
  if (filteredTasks.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Har task ke liye ek <li> element banate hain
  filteredTasks.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'task-item priority-' + task.priority + (task.done ? ' done' : '');
    // data-id se hum yaad rakhte hain ki yeh <li> kaunse task se juda hai
    li.dataset.id = task.id;

    // Andar ka HTML: checkbox + task text + priority tag + delete button
    li.innerHTML =
      '<button class="task-checkbox">' + (task.done ? '✓' : '') + '</button>' +
      '<span class="task-text"></span>' +
      '<span class="task-tag tag-' + task.priority + '">' + task.priority + '</span>' +
      '<button class="delete-btn">&times;</button>';

    // Task text ko textContent se set kar rahe hain (innerHTML se nahi)
    // taaki agar user "<script>" jaisa kuch type kare to woh sirf
    // text ki tarah dikhe, code ki tarah chal na jaaye (security best practice)
    li.querySelector('.task-text').textContent = task.text;

    taskList.appendChild(li);
  });

  // ===== Stats update karna (total / done / pending) =====
  statTotal.textContent = tasks.length;
  const doneCount = tasks.filter(function (t) { return t.done; }).length;
  statDone.textContent = doneCount;
  statPending.textContent = tasks.length - doneCount;
}

// Ek helper function jo save + render dono ek saath kar de
function saveAndRender() {
  saveData();
  render();
}

// ===== STEP 8: Page load hote hi ek baar render kar do =====
// taaki agar pehle se saved tasks hain, to woh turant dikh jaayein
render();
