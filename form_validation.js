window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    name.addEventListener('input', function () {
      if (name.value.length == 0) {
        setTextValue('.text-error',"");
        return;
      }
      try {
        checkName(name.value);
        setTextValue('.text-error',"");
      }
      catch (e) {
        setTextValue('.text-error',"e")
      }
    });

      const date = document.querySelector('#date');
date.addEventListener('input', function() {
   const startDate = Date.parse(getInputValueById('#day') + " " +
                                                getInputValueById('#month') + " " +
                                                getInputValueById('#year'));
   try {
      checkStartDate(new Date(Date.parse(startDate)));
      setTextValue('.date-error', "");
   } catch (e) {
      setTextValue('.date-error', e);
}
});
  
    const salary = document.querySelector('#salary');
    setTextValue('.salary-output',salary.value);
    salary.addEventListener('input', function () {
      output.textContent = salary.value;
    });
    document.querySelector('#cancelButton').href = site-properties.home_page;
    checkForUpdate();
});

const save = () => {
    try {
      let employeePayrollData = createEmployeePayroll();
      createAndUpdateStorage(employeePayrollData);
    }
    catch (e) {
      return;
    }
  }
  const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
      employeePayrollData.name = getInputValueById('#name');
    }
    catch (e) {
      setTextValue('.text-error', e);
      throw e;
    }
  
    employeePayrollData.profileImage = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById("#salary");
    employeePayrollData.note = getInputValueById("#notes");
  
    let date = getInputValueById("#day") + "-" + getInputValueById("#month") + "-" + getInputValueById("#year");
    employeePayrollData.startDate = new Date(Date.parse(date));
  
    alert(employeePayrollData.toString());
    return employeePayrollData;
  }
  
  const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach((item) => {
      if (item.checked) selItems.push(item.value);
    });
    return selItems;
  };
  
  const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
  };
  
  const getInputElementValue = (id) => {
    let value = document.getElementById(id).value;
    return value;
  };

  const setEmployeePayrollObject = () => {
    if(!isUpdate) employeePayrollObj.id = createNewEmployeeID();
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " "
       + getInputValueById('#year');
    employeePayrollData._start_date = date;
  }

  const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList) {
       let empPayrollData = employeePayrollList
          .find(empData => empData._id == employeePayrollObj._id);
       if (!empPayrollData) {
          employeePayrollList.push(employeePayrollObj);
       } else {
          const index = employeePayrollList
             .map(empData => empData._id)
             .indexOf(employeePayrollData._id);
          employeePayrollList.splice(index, 1,
            employeePayrollObj);
       }
    } else {
       employeePayrollList = [createEmployeePayrollData()];
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
  }
  const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day','1');
    setValue('#month','January');
    setValue('#year','2020');
  }

  const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    })
  }
  
  const setTextValue = (id, value) => {
    const element  = document.querySelector(id);
    element.textContent = value;
  }

  const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
  }