const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData();
}

const loadData = async () => {
    // Load user ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data)

    // นำ user  ทั้งหมดที่โหลดมาใส่เข้าไปใน html
    const userDOM = document.getElementById('user')
    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<tr>
                <td>${user.id}</td>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td><a href='register.html?id=${user.id}'><button class="table-btn">edit</button></a></td>
                <td><button class='delete' data-id='${user.id}'>delete</button></td>
            </tr>`
    }

    // ${user.id} ${user.firstname} ${user.lastname}
    // <a href='register.html?id=${user.id}'><button>edit</button></a>
    // <button class='delete' data-id='${user.id}'>delete</button>
        
    htmlData += '</div>'

    userDOM.innerHTML = htmlData

    // เราสร้าง button class ='delete' มาแล้ว
    const deleteDOMs = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            // ดึง id ออกมา
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                // loadData() // recursive function = เรียก functin ตัวเอง
                window.location.reload(); 
            } catch (error) {
                console.log('error', error)
            }
        })
    }
}