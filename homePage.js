let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    if(site_properties.use_local_storage.match("true")){
    getEmployeePayrollDataFromStorage();
    }
    else getEmployeePayrollDataFromServer();
});

const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
    .then(reponseText => {
        empPayrollList = JSON.parse(responseText);
        processEmployeePayrollDataResponse();
    })
    .catch(error => {
        console.log("GET Error Status: " +JSON.stringify(error));
        empPayrollList = [];
        processEmployeePayrollDataResponse();
    });
}
const getEmployeePayrollDataFromStorage = () => {
    empPayrollList = localStorage.getItem('EmployeePayrollList') ?
                        JSON.parse(localStorage.getItem('EmployeePayrollList')):[];
    processEmployeePayrollDataResponse();
}

const createInnerHtml = () => {
    if (empPayrollList.length == 0) return;
    const headerHtml = "<th></th><th>Name</th><th>Gender</th>" +
        "<th>Department</th><th>Salary</th><th>Start Date</th>" +
        "<th>Actions</th>";
    let innerHtml = `${headerHtml}`;
    //let empPayrollList = createEmployeePayrollJSON();  
    for (const empPayrollData of empPayrollList) {
        innerHtml = `${innerHtml}
        <tr>
            <td>
                <img class="profile" alt="" src="${empPayrollData._profilePic}">
            </td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>
                ${getDeptHtml(empPayrollData._department)}
            </td>
            <td>${empPayrollData._salary}</td>
            <td>${empPayrollData._start_date}</td>
            <td>
                <img id="${empPayrollData._id}" onclick="remove(this)" alt="delete"
                            src="../assets/icons/delete-black-18dp.svg">
                <img id="${empPayrollData._id}" onclick="update(this)" alt="edit"
                            src="../assets/icons/create-black-18dp.svg">           
            </td>
        </tr>
        `;
    }
    document.querySelector("#table-display").innerHTML = innerHtml;
};

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class="dept-label">${dept}</div>`
    }
    return deptHtml;
}

const createEmployeePayrollJSON = () => {
    let empPayrollListLocal = [
        {
            _name: 'Ullas Kumar',
            _gender: 'Male',
            _department: [
                'Full stack','Web Developmet', 'Engineer'
            ],
            _salary: '500000',
            _start_date: '21 Oct 2022',
            _note: '',
            _profilePic: '../assets/profile-images/Ellipse -3.png',
        },
        {
            _name: 'Regina',
            _gender: 'Female',
            _department: [
               'Sales','Finance', 'HR'
            ],
            _salary: '300000',
            _start_date: '01 Nov 2022',
            _note: '',
            _profilePic: '../assets/profile-images/Ellipse 4.png'        
        }
    ]
    return empPayrollListLocal;
}

const remove = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData._id == node.id);
    if( !empPayrollData ) return;
    const index = empPayrollList
                    .map( empData => empData._id )
                    .indexOf(empPayrollData._id);
    empPayrollList.splice(index, 1);
    if(site_properties.use_local_storage.match("true")){
        localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
        createInnerHtml();
    }else {
        const deleteURL = site_properties.server_url + empPayrollData.id.toString();
        makeServiceCall("DELETE", deleteURL, false)
        .then(reponseText => {
            createInnerHtm();
        })
        .catch(error => {
            console.log("DELETE Error Status: " + JSON.stringify(error));
        });
}
}