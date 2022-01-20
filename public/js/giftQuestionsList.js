$(document).ready(() => {
    getQuestionsList();
    
});

let newRows = [];
function getQuestionsList() {
    const datatablesSimple = document.getElementById("datatablesSimple");
    const dataTable = new simpleDatatables.DataTable(datatablesSimple);
    $.ajax({
        type: "GET",
        url: `/api/giftQuestions/`,
        data: {},
        success: (res) => {
            const allGiftQuestions = res;
            for (let i = 0; i < allGiftQuestions.length; i++) {
                let tempRow = [];
                tempRow.push(`${i + 1}`);
                tempRow.push(allGiftQuestions[i].giftQuestionType);
                tempRow.push(allGiftQuestions[i].giftQuestion);
                tempRow.push(`<input type="button" id="${allGiftQuestions[i].giftQuestion_id}" onclick="location.href='/giftQuestions/${allGiftQuestions[i].giftQuestion_id}'"
                class="btn btn-outline-primary" value="상세페이지">`);
                tempRow.push(
                    `<img src="../public/assets/img/deleteBtn.png" id="delete${allGiftQuestions[i].giftQuestion_id}" onClick="deleteItem(this.id)" width="40px" style="cursor:pointer;">`
                );

                newRows.push(tempRow);
            }

            dataTable.rows().add(newRows);
        },
    });
}

function moveToInsert() {
    location.href = "/giftQuestionsInsert";
}

function deleteItem(id) {
    let giftQuestion_id = id.split("delete")[1]
    if (confirm("정말로 삭제하시겠습니까?") == true) {
    } else {
        return false;
    }
    $.ajax({
        type: "DELETE",
        url: `/api/giftQuestions/${giftQuestion_id}`,
        data: {},
        success: function (response) {
            location.href = location.href
            history.go(0);
        },
        error: function (error) {
            alert(error.responseJSON.errorMessage)
        },
    });
}


let selectedColum = [];
let columData = [];
function exportExcel() {
  
    categoryName = [];
    for (let i = 0; i < 3; i++) { 
        categoryName.push(document.getElementsByTagName('th')[i].innerText)
    }
    console.log(categoryName)
  
    // 데이터인 newRows만큼 추출
    for (let i = 0; i < newRows.length; i++) {
        // 필요한 컬럼의 데이터만 추출해서 배열로 만듬
        for (let j = 0; j < 3; j++) {
            if (i == 0) { // 이 부분 수정중
                for (let z = 0; z < 1; z++) { 
                    selectedColum.push(document.getElementsByTagName('th')[j].innerText)
                }
            }
            selectedColum.push(newRows[i][j])
        }
    }
    // row 마다 하나의 배열에 담음 (배열 안에 3개씩 담긴 배열을 만듬)
    for (i = 0; i < selectedColum.length; i += 3) {
        columData.push(selectedColum.slice(i, i + 3));
    }
    
    // step 1. workbook 생성
    const wb = XLSX.utils.book_new();
    // step 2. 시트 만들기 
    const newWorksheet = excelHandler.getWorksheet();
    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());
    // step 4. 엑셀 파일 만들기 
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    // step 5. 엑셀 파일 내보내기 
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), excelHandler.getExcelFileName());
}

const excelHandler = {
    getExcelFileName: function () {
        return 'sasohae-data.xlsx';
    },
    getSheetName: function () {
        return 'sasohae Sheet';
    },
    getExcelData: function () {
        return columData;
    },
    getWorksheet: function () {
        return XLSX.utils.aoa_to_sheet(this.getExcelData());
    }
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}