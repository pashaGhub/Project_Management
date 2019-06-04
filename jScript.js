let projectList = [];
let deletedList = [];
let arrToUse = [];
let sortBy = "expirationDate";

document.getElementById('createBtn').addEventListener('click', function() {

  const obj = {
    prName: document.getElementById('projName').value,
    orderDate: document.getElementById('orderDate').value,
    expDate: document.getElementById('expDate').value,
    comment: document.getElementById('comment').value,
    delete: true,
    start: true,
    complete: false,
    remove: false,
    status: "active"
  }

  projectList.push(obj);
  window.localStorage.setItem("projectInfo", JSON.stringify(projectList));

  printProject();

})

function printProject() {
  document.getElementById('printedProjects').innerHTML = null;

  switch (sortBy) {
    case "name":
      arrToUse.sort((a, b) => (a.prName < b.prName) ? -1 : 1);
      break;
    case "orderDate":
      arrToUse.sort((a, b) => (a.orderDate < b.orderDate) ? -1 : 1);
      break;
    case "expirationDate":
      arrToUse.sort((a, b) => (a.expDate < b.expDate) ? -1 : 1);
      break;
    default:
      arrToUse.sort((a, b) => (a.expDate < b.expDate) ? -1 : 1);
  }



  arrToUse.forEach((value, ind, arr) => {

    let project = document.createElement('div');
    let projectName = document.createElement('div');
    let projectOrderDate = document.createElement('div');
    let projectExpDate = document.createElement('div');
    let projectComment = document.createElement('div');
    let deleteBtn = document.createElement('button');
    let startBtn = document.createElement('button');
    let completeBtn = document.createElement('button');
    let removeBtn = document.createElement('button');

    if(value.status == "active"){
      let currentTime = new Date();
      let projectTime = new Date(value.expDate);
      let timeLeft = (projectTime - currentTime) / 1000 / 60 / 60 / 24;
      if (timeLeft < 7){
        project.classList = "row row-box border-danger";
      } else if (timeLeft < 14){
        project.classList = "row row-box border-warning";
      } else if (timeLeft > 14){
        project.classList = "row row-box border-primary";
      } else {
        project.classList = "row row-box border-deleted";
      }
    } else if (value.status == "completed") {
      project.classList = "row row-box border-new";
    } else if (value.status == "deleted") {
      project.classList = "row row-box border-deleted";
    }



    // project.classList = "row row-box border-danger";
    projectName.classList = "col";
    projectOrderDate.classList = "col";
    projectExpDate.classList = "col";
    projectComment.classList = "col";
    deleteBtn.classList = "btn btn-danger";
    startBtn.classList = "btn btn-info";
    completeBtn.classList = "btn btn-success";
    removeBtn.classList = "btn btn-secondary";

    projectName.textContent = "Project name: " + value.prName;
    projectOrderDate.textContent = "Order date: " + value.orderDate;
    projectExpDate.textContent = "Expiration date: " + value.expDate;
    projectComment.textContent = "Comment: " + value.comment;
    deleteBtn.textContent = "Delete";
    startBtn.textContent = "Start";
    completeBtn.textContent = "Complete";
    removeBtn.textContent = "Remove";

    project.appendChild(projectName);
    project.appendChild(projectOrderDate);
    project.appendChild(projectExpDate);
    project.appendChild(projectComment);

    value.delete ? project.appendChild(deleteBtn) : false;
    value.start ? project.appendChild(startBtn) : false;
    value.complete ? project.appendChild(completeBtn) : false;
    value.removeBtn ? project.appendChild(removeBtn) : false;

    document.getElementById('printedProjects').appendChild(project);

    deleteBtn.addEventListener('click', function() {
        deletedList = deletedList.concat(projectList.splice(ind, 1));
        value.status = "deleted";
        value.delete = false;
        value.start = false;
        value.complete = false;
        value.removeBtn = true;
        window.localStorage.setItem("projectInfo", JSON.stringify(projectList));
        window.localStorage.setItem("deletedProject", JSON.stringify(deletedList));
        printProject();
    });

    startBtn.addEventListener('click', function() {
        value.delete = false;
        value.start = false;
        value.complete = true;
        window.localStorage.setItem("projectInfo", JSON.stringify(projectList));
        printProject();
    });

    completeBtn.addEventListener('click', function() {
        value.delete = true;
        value.start = false;
        value.complete = false;
        value.status = "completed";
        window.localStorage.setItem("projectInfo", JSON.stringify(projectList));
        printProject();
    });

    removeBtn.addEventListener('click', function() {
      if (window.confirm("Project will be deleted irreversibly. Do you really want to proceed?")) {
        deletedList.splice(ind, 1);
        window.localStorage.setItem("deletedProject", JSON.stringify(deletedList));
        printProject();
      };
    });
  });
};

document.getElementById('nameBtn').addEventListener('click', function(){
  sortBy = "name";
  this.classList.add("active");
  document.getElementById('orderBtn').classList.remove("active");
  document.getElementById('expBtn').classList.remove("active");
  printProject();
});

document.getElementById('orderBtn').addEventListener('click', function(){
  sortBy = "orderDate";
  this.classList.add("active");
  document.getElementById('nameBtn').classList.remove("active");
  document.getElementById('expBtn').classList.remove("active");
  printProject();
});

document.getElementById('expBtn').addEventListener('click', function(){
  sortBy = "expirationDate";
  this.classList.add("active");
  document.getElementById('orderBtn').classList.remove("active");
  document.getElementById('nameBtn').classList.remove("active");
  printProject();
});

document.getElementById('dltList').addEventListener('click', function(){
  arrToUse = deletedList;
  this.classList.add("active");
  document.getElementById('activeList').classList.remove("active");
  printProject();
});

document.getElementById('activeList').addEventListener('click', function(){
  arrToUse = projectList;
  this.classList.add("active");
  document.getElementById('dltList').classList.remove("active");
  printProject();
});


let fromCasheActive = localStorage.getItem("projectInfo");
if(fromCasheActive){
  projectList = JSON.parse(fromCasheActive);
  printProject();
};

let fromCasheDel = localStorage.getItem("deletedProject");
if(fromCasheDel){
  deletedList = JSON.parse(fromCasheDel);
  printProject();
};
