const mysql = require('mysql');
const mysqlConfig = require('./creds.js')
const inquirer = require('inquirer')

const connection = mysql.createConnection(mysqlConfig)

//stop and start connection
function sqlConnectionStart() {
    connection.connect((err) => {
        if (err) throw err
    })
}

//Add Connections
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Department Name:',
            name: 'depName'
        },
    ])
    .then(response => {
        const {depName} = response
        afterAddDepartment(depName)
    })
}

function afterAddDepartment(depName) {
    connection.query(`INSERT INTO department SET ?`, 
    {name: depName}, 
    (err, res) => {
        if (err) throw err 
        menuLoad() 
    })
}

function addRole() {
    connection.query('SELECT id, name FROM department',
    (err, departmentRes) => {
        if (err) throw err
        //create display key with string of department and ID
        departmentRes.forEach(dept => {
            dept.display = `${dept.name}, Id:${dept.id}` 
        })
        const displayDepartments = departmentRes.map(dept => dept.display)
        // let displayDepartments = departmentRes
        inquirer.prompt([
            {
                type: 'input',
                message: 'Role Title:',
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: 'Role Salary:',
                name: 'roleSalary'
            },
            {
                type: 'list',
                message: "Associated Department",
                name: 'depIdName',
                choices: displayDepartments
            }
        ])
        .then(response => {
            const {roleTitle, roleSalary, depIdName} = response
            //takes depIdName and filters
            const chosenDept = departmentRes.filter(dept => dept.display === depIdName)[0]
            afterAddRole(roleTitle, roleSalary, chosenDept.id)
        })
    })
}

function afterAddRole(roleTitle, roleSalary, depId) {
    connection.query(`INSERT INTO role set ?`,
    {title: roleTitle, salary: roleSalary, department_id: depId,}, 
    (err, res) => {
            if (err) throw err  
            menuLoad() 
    })
}

function addEmployee() {
    connection.query('SELECT id, title FROM role', 
    (err, roleRes) => {
        if (err) throw err
        roleRes.forEach(role => {
            role.display = `${role.title}, Id:${role.id}` 
        })
        const displayRoles = roleRes.map(role => role.display)

        connection.query('SELECT id, first_name, last_name FROM employee', 
        (err, empRes) => {
            if (err) throw err
            empRes.forEach(emp => {
                emp.display = `${emp.first_name} ${emp.last_name}, Id:${emp.id}` 
            })
            
            empRes.push(nulldata = {id: null, display: "None"})
            const displayEmployees = empRes.map(emp => emp.display)
           
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Employee First Name:',
                    name: 'empFirstName'
                },
                {
                    type: 'input',
                    message: 'Employee Last Name:',
                    name: 'empLastName'
                },
                {
                    type: 'list',
                    message: 'Associated Role:',
                    name: 'roleId',
                    choices: displayRoles
                },
                {
                    type: 'list',
                    message: 'Manager:',
                    name: 'managerId',
                    choices: displayEmployees
                }
            ])
            .then(response => {
                const {empFirstName, empLastName, roleId, managerId} = response
                const chosenRole = roleRes.filter(role => role.display === roleId)[0]
                const chosenEmp = empRes.filter(emp => emp.display === managerId)[0]
                afterAddEmployee(empFirstName, empLastName, chosenRole.id, chosenEmp.id)
            })
        })
    })
}

function afterAddEmployee(empFirstName, empLastName, roleId, mangerId) {
    connection.query('INSERT INTO employee SET ?',
    {first_name: empFirstName, last_name: empLastName, role_id: roleId, manager_id: mangerId}, 
    (err, res) => {
        if (err) throw err 
        menuLoad()  
    })
}

//Update Connection

function updateEmployee() { 
    connection.query('SELECT id, title FROM role', 
    (err, roleRes) => {
        if (err) throw err
        roleRes.forEach(role => {
            role.display = `${role.title}, Id:${role.id}` 
        })

        const displayRoles = roleRes.map(role => role.display)

        connection.query('SELECT id, first_name, last_name FROM employee', 
        (err, empRes) => {
            if (err) throw err
            empRes.forEach(emp => {
                emp.display = `${emp.first_name} ${emp.last_name}, Id:${emp.id}` 
            })

            const displayEmployees = empRes.map(emp => emp.display)

            empRes.push(nulldata = {id: null, display: "None"})
            const displayManagers = empRes.map(emp => emp.display)
           
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Update Employee:',
                    name: 'empToUpdate',
                    choices: displayEmployees
                },
                {
                    type: 'list',
                    message: 'New Role:',
                    name: 'newRoleId',
                    choices: displayRoles
                },
                {
                    type: 'list',
                    message: 'New Manager:',
                    name: 'newManagerId',
                    choices: displayManagers
                }
            ])
            .then(response => {
                const {empToUpdate, newRoleId, newManagerId} = response
                const chosenEmp = empRes.filter(emp => emp.display === empToUpdate)[0]
                const chosenRole = roleRes.filter(role => role.display === newRoleId)[0]
                const chosenManager = empRes.filter(emp => emp.display === newManagerId)[0]
                afterUpdateEmployee(chosenEmp.id, chosenRole.id, chosenManager.id)
            })
        })
    }) 
}

function afterUpdateEmployee(chosenEmpId, chosenRoleId, chosenManagerId) {
    connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
            {
                role_id: chosenRoleId,
                manager_id:chosenManagerId
            },
            {
                id: chosenEmpId,
            },
        ],
        (error) => {
          if (error) throw err
          console.log('Update Sucessful')
          menuLoad()
        }
      )
}

// View Connections
function viewDepartments() {
    connection.query('SELECT id, name FROM department', 
    (err, res) => {1
        if (err) throw err
        console.log(res)
        console.table(res)
        menuLoad()
    })
}

function viewRoles() {
    connection.query('SELECT role.id, title, salary, name FROM role LEFT JOIN department ON department.id = role.department_id', 
    (err, res) => {
        if (err) throw err
        console.table(res)
        menuLoad()
    })
}

function viewEmployees() { 
    connection.query('SELECT employee.id, first_name, last_name, title, salary, department.name, manager_id FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id', 
    (err, res) => {
        if (err) throw err

        const tableDis = res.map(obj => {
            let managerSearch = res.map(manSearch => {
                if (obj.manager_id === manSearch.id) {
                    return `${manSearch.first_name} ${manSearch.last_name}`
                }
            })
            let managerName = managerSearch.filter(val => val !== undefined)[0]
            if (managerName === undefined) {
                return {
                    id: obj.id,
                    name: `${obj.first_name} ${obj.last_name}`,
                    salary: obj.salary,
                    title: obj.title,
                    manager: null,
                    department_name: obj.name
                }
            }
            else return {
                id: obj.id,
                name: `${obj.first_name} ${obj.last_name}`,
                salary: obj.salary,
                title: obj.title,
                manager: managerName,
                department_name: obj.name
            }
        })

        console.table(tableDis)
        menuLoad()
        
    })
}

// Delete Connections
function deleteDepartment() {
    connection.query('SELECT id, name FROM department',
    (err, departmentRes) => {
        if (err) throw err
        
        departmentRes.forEach(dept => {
            dept.display = `${dept.name}, Id:${dept.id}` 
        })

        departmentRes.push(nulldata = {display: "Return to main menu"})
        const displayDepartments = departmentRes.map(dept => dept.display)
        
        inquirer.prompt([
            {
                type: 'list',
                message: "Delete Department",
                name: 'depIdName',
                choices: displayDepartments
            }
        ])
        .then(response => {
            const {depIdName} = response
            if (response === "Return to main menu") {menuLoad()}
            else {
                const chosenDept = departmentRes.filter(dept => dept.display === depIdName)[0]
                afterDeleteDepartment(chosenDept.id)
            }
        })
    })
}

function afterDeleteDepartment(deptId) {
    connection.query(`DELETE FROM department WHERE ?`, { id: deptId })
    console.log("Sucessfully deleted")
    menuLoad()
}

function deleteRole() {
    connection.query('SELECT id, title FROM role',
    (err, roleRes) => {
        if (err) throw err
        
        roleRes.forEach(role => {
            role.display = `${role.title}, Id:${role.id}` 
        })

        roleRes.push(nulldata = {display: "Return to main menu"})
        const displayRoles = roleRes.map(role => role.display)
        
        inquirer.prompt([
            {
                type: 'list',
                message: "Delete role",
                name: 'roleIdName',
                choices: displayRoles
            }
        ])
        .then(response => {
            const {roleIdName} = response
            if (response === "Return to main menu") {menuLoad()}
            else {
                const chosenRole = roleRes.filter(role => role.display === roleIdName)[0]
                afterDeleteRole(chosenRole.id)
            }
        })
    })
}

function afterDeleteRole(roleId) {
    connection.query(`DELETE FROM role WHERE ?`, { id: roleId })
    console.log("Sucessfully deleted")
    menuLoad()
}

function deleteEmployee() {
    connection.query('SELECT id, first_name, last_name FROM employee',
    (err, empRes) => {
        if (err) throw err
        empRes.forEach(emp => {
            emp.display = `${emp.first_name} ${emp.last_name}, Id:${emp.id}` 
        })

        empRes.push(nulldata = {display: "Return to main menu"})
        const displayEmployees = empRes.map(emp => emp.display)
        inquirer.prompt([
            {
                type: 'list',
                message: "Delete emp",
                name: 'empIdName',
                choices: displayEmployees
            }
        ])
        .then(response => {
            const {empIdName} = response
            if (response === "Return to main menu") {menuLoad()}
            else {
                const chosenEmp = empRes.filter(emp => emp.display === empIdName)[0]
                afterDeleteEmployee(chosenEmp.id)
            }
        })
    })
}

function afterDeleteEmployee(empId) {
    connection.query(`DELETE FROM employee WHERE ?`, { id: empId })
    console.log("Sucessfully deleted")
    menuLoad()
}



function afterMenuLoad(response) {
    if (response.menu === 'add department') {addDepartment()}
    if (response.menu === 'add role') {addRole()}
    if (response.menu === 'add employee') {addEmployee()}
    if (response.menu === 'update employee') {updateEmployee()}
    if (response.menu === 'view departments') {viewDepartments()}
    if (response.menu === 'view roles') {viewRoles()}
    if (response.menu === 'view employees') {viewEmployees()}
    if (response.menu === 'delete department') {deleteDepartment()}
    if (response.menu === 'delete role') {deleteRole()}
    if (response.menu === 'delete employee') {deleteEmployee()}
    if (response.menu === 'end') {connection.end()}
}

function menuLoad() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'menu',
            choices: [ 
                'add department',
                'add role',
                'add employee',
                'update employee',
                'view departments',
                'view roles',
                'view employees',
                'delete department',
                'delete role',
                'delete employee',
                'end'
            ]
        }
    ])
    .then(afterMenuLoad)
}

//init call
function init() {
    sqlConnectionStart()
    menuLoad()
}

init()
