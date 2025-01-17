checkAdmin()

// 기본 URL
const backend_base_url = "http://127.0.0.1:8000"
// const backend_base_url = "http://ec2-3-39-193-171.ap-northeast-2.compute.amazonaws.com:8000"
const frontend_base_url = "http://127.0.0.1:5500"


// 정수 값을 문자열로 변환하는 함수
function getSpotString(spot) {
  switch (spot) {
    case 1:
      return '고양점'
    case 2:
      return '대구점'
    case 3:
      return '세종점'
    case 4:
      return '양주점'
    case 5:
      return '포항점'
    default:
      return ''
  }
}

async function roomList() {
  const accessToken = localStorage.getItem('access')
  const response = await fetch(`${backend_base_url}/manager/rooms/`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    method: 'GET',
  })

  const response_json = await response.json()

  response_json.forEach((a) => {
    const spot = getSpotString(a['spot']) // 문자열로 변환된 지점 정보
    const name = a['name']
    const price = a['price']
    const max_members = a['max_members']
    const status = a['status']

    if (status == 'empty') {
      let temp_html = `<tr>
            <th>${a.id}</th>
            <th>${spot}</th>
            <th>${name}</th>
            <td>${price}</td>
            <td>${max_members}</td>
            <td style='color:blue;'>${status}</td>
            <td><button class="btn btn-secondary"
            onclick="changeStatus(${a.id}, '${status === 'empty' ? 'checkin' : 'empty'}')">객실상태 변경</button></td>
        </tr>`
      $('#room_info').append(temp_html)

    } else {
      let temp_html2 = `<tr>
            <th>${a.id}</th>
            <th>${spot}</th>
            <th>${name}</th>
            <td>${price}</td>
            <td>${max_members}</td>
            <td style='color:red;'>${status}</td>
            <td><button class="btn btn-secondary"
            onclick="changeStatus(${a.id}, '${status === 'empty' ? 'checkin' : 'empty'}')">객실상태 변경</button></td>
        </tr>`
      $('#room_info').append(temp_html2)
    }


  })
}
// 객실상태 변경 버튼을 클릭했을시 patch로 데이터 베이스의 값을 바꿀 수 있도록 하였습니다.
async function changeStatus(id, status) {
  const accessToken = localStorage.getItem('access')
  const response = await fetch(`${backend_base_url}/manager/rooms/${id}/`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  const response_json = await response.json()
  // console.log(response_json)
  window.location.reload()
}
roomList()