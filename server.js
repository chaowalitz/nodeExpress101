const express = require ('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

let conn = null;
const initMysql = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tutorial',
    })
};

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname) {
        errors.push('กรุณใส่ชื่อจริง')
    }
    if (!userData.lastname) {
        errors.push('กรุณใส่นามสกุลจริง')
    }
    if (!userData.age) {
        errors.push('กรุณใส่อายุ')
    }
    if (!userData.gender) {
        errors.push('กรุณใส่เพศ')
    }
    if (!userData.interests) {
        errors.push('กรุณใส่สิ่งที่คุณสนใจ')
    }
    return errors
};

// promise
// app.get('/testdb', (req, res) => {
//     mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'tutorial',
//     }).then((conn) => {
//         conn
//         .query('SELECT * FROM users')
//         .then((result) => {
//             res.json(result[0]);
//         })
//         .catch((err) => {
//             console.error('Error fetching users: ',err.message);
//             res.status(500).json({err: 'Error fetching users'})
//         });
//     });
// })

// async await
// app.get('/testdb-new', async (req, res) => {
//     try {
//         const conn = await mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: '',
//             database: 'tutorial',
//         })
//         const results = await conn.query('SELECT * FROM users')
//             res.json(results[0]);
//     } catch (error) {
//         console.error('Error fetching users: ', error.message);
//         res.status(500).json({error: 'Error fetching users'})
//     }  
// })

app.get('/testdb-new', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching users: ', error.message);
        res.status(500).json({error: 'Error fetching users'})
    }  
})
// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา DB
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0]);
  })
// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป DB
app.post('/users', async (req,res) => {
    try {
        let user = req.body;
        const errors = validateData(user);
        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'insert ok',
            user: results[0]
        });
    } catch (error) {
        const errorMessage = error.message || 'sonething wrong'
        const errors = error.errors || []
        console.error('error message' , error.message);
        res.status(500).json({
            message: errorMessage,
            errors: errors
        });
    }
})
// path = GET /users/:id สำหรับดึง users รายคนออกมา DB
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        // หา user จาก id ที่ส่งมา
        const results = await conn.query('SELECT * FROM users WHERE id = ?' , id)
        //แบบที่ 1
        if (results[0].length > 0) {
            res.json(results[0][0]);  // array [0] แต่ถ้าต้องการให้เป็น obj ใส่[0][0]
        } else {
            res.status(404).json({
                message:'หาไม่เจอ'
            });
        }
        //แบบที่ 2
        // if (results[0].length == 0) {
        //    throw { statusCode : 404, message: 'หาไม่เจอ'}
        // } 
        // res.json(results[0][0]);  // array [0] แต่ถ้าต้องการให้เป็น obj ใส่[0][0]  

    } catch (error) {
        console.error('error message' , error.message);
        res.status(500).json({
            message:'sonething wrong'
        });
        //แบบที่ 2
        // let statusCode = error.statusCode || 500
        // res.status(statusCode).json({
        //     message:'sonething wrong',
        //     errorMessage: error.message
        // });
    }
  })
// path = PUT /users/:id สำหรับการแก้ไข users รายคน ( ตาม id ที่บันทึกเข้าไป ) DB
app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateUser = req.body
        const results = await conn.query('UPDATE users SET ? WHERE id = ?',
        [updateUser, id]
        )
        res.json({
            message: 'update ok',
            user: results[0]
        });
    } catch (error) {
        console.error('error message' , error.message);
        res.status(500).json({
            message:'sonething wrong'
        });
    }
});
// path = DELETE /users/:id สำหรับการลบ users รายคน ( ตาม id ที่บันทึกเข้าไป ) DB
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE from users WHERE id = ?', id)
        res.json({
            message: 'delete ok',
            user: results[0]
        });
    } catch (error) {
        console.error('error message' , error.message);
        res.status(500).json({
            message:'sonething wrong'
        });
    }
});






















// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
// app.get('/users', (req, res) => {
//     const filterUsers = users.map(user => {
//         return {
//             id: user.id,
//             user: user.user,
//             pass: user.pass,
//             firstname: user.firstname,
//             lastname: user.lastname,
//             fullname: user.firstname + ' ' + user.lastname
//         }
//     });
//     res.json(filterUsers);
//   })
// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
// app.post('/users', (req,res) => {
//     let user = req.body;
//     user.id = counter;
//     counter++;

//     users.push(user);
//     res.json({
//         message: 'add ok',
//         user: user
//     });
// })
// path = GET /users/:id สำหรับดึง users รายคนออกมา
// app.get('/users/:id', (req, res) => {
//     let id = req.params.id;
//     // หา user จาก id ที่ส่งมา
//     let selectedIndex = users.findIndex((user) => user.id == id)
    
//     res.json(users[selectedIndex]);
//   })
// path = PUT /users/:id สำหรับการแก้ไข users รายคน ( ตาม id ที่บันทึกเข้าไป )
// app.put('/users/:id', (req, res) => {
//     let id = req.params.id;
//     let updateUser = req.body

//     // หา user จาก id ที่ส่งมา
//     let selectedIndex = users.findIndex((user) => user.id == id)

//     // update user นั้น
//     users[selectedIndex].user = updateUser.user || users[selectedIndex].user
//     users[selectedIndex].pass = updateUser.pass || users[selectedIndex].pass
//     users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
//     users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname

//     //user ที่ update ใหม่ update กลับเข้าไปที่ users ตัวเดิม

//     res.json({
//         message: 'update user complete!',
//         data: {
//             user: updateUser,
//             indexUpdate: selectedIndex
//         }
//     });
// });
// app.patch('/users/:id', (req, res) => {
//     let id = req.params.id;
//     let updateUser = req.body

//     // หา user จาก id ที่ส่งมา
//     let selectedIndex = users.findIndex((user) => user.id == id)

//     // update user นั้น
//     if (updateUser.user) {
//         users[selectedIndex].user = updateUser.user
//     }
//     if (updateUser.pass) {
//         users[selectedIndex].pass = updateUser.pass
//     }
//     //user ที่ update ใหม่ update กลับเข้าไปที่ users ตัวเดิม

//     res.json({
//         message: 'update user complete!',
//         data: {
//             user: updateUser,
//             indexUpdate: selectedIndex
//         }
//     });
// });
// path = DELETE /users/:id สำหรับการลบ users รายคน ( ตาม id ที่บันทึกเข้าไป )
// app.delete('/users/:id', (req, res) => {
//     let id = req.params.id
//     //หาก่อ่นว่า index ของ user ที่จะลบคือ index ไหน
//     let selectedIndex = users.findIndex(user => user.id == id)
//     // ลบ index เหลือค่า null
//     //delete users[selectedIndex]
//     // ลบ index ไม่เหลือค่า null
//     users.splice(selectedIndex, 1)

//     res.json({
//         message: 'delete complete!',
//         indexDeleted: selectedIndex
//     })

// });

app.listen(port, async (req, res) => {
    await initMysql();
    console.log('listening on port ' + port);
});