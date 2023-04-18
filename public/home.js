const penghasilan = document.querySelector("#penghasilan")
const pendapatan = document.querySelector("#pendapatan")
const kegiatanCreate = document.querySelector("#kegiatanCreate")
const pendapatanCreate = document.querySelector("#pendapatanCreate")


document.addEventListener("click", (e) => {

    if (e.target.id === "perbaiki") {
        const kontenKiri = document.querySelectorAll(".kontenKiri")
        for (kontenkiris of kontenKiri) {
            kontenkiris.setAttribute("data-harga", kontenkiris.innerHTML);
            kontenkiris.innerHTML =
                `
            <div class="editPendapatan badge bg-primary me-1" data-bs-toggle="modal" data-bs-target="#modalEdit" style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;" ><i class="bi bi-pencil-square"></i> Edit</div>
            <div class="hapusPendapatan badge bg-danger" data-bs-toggle="modal" data-bs-target="#modalHapus"  style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;"><i class="bi bi-trash-fill"></i> Hapus</div>
            `
        }
        e.target.setAttribute("id", "diperbaiki")
    } else if (e.target.id === "diperbaiki") {
        const kontenKiri = document.querySelectorAll(".kontenKiri")
        for (kontenkiris of kontenKiri) {
            kontenkiris.innerHTML = kontenkiris.getAttribute("data-harga")
        }
        e.target.removeAttribute("data-harga");
        e.target.setAttribute("id", "perbaiki")
    }

    if (e.target.classList.contains("submitCreate")) {
        const formCreate = document.querySelector("#formCreate")
        const opsi = e.target.getAttribute("data-opsi");
        if(kegiatanCreate.value === ""){
            kegiatanCreate.setAttribute("placeholder","Kegiatan Wajib Di isi")
            return false
        }
        if(pendapatanCreate.value === ""){
            pendapatanCreate.setAttribute("placeholder","Pendapatan Wajib di isi")
            return false
        }
        if(opsi === "rugi"){
            pendapatanCreate.value = `-${pendapatanCreate.value}`
        }
        fetch("/home",{
            method:"post",
            body:new FormData(formCreate)
        })



    }


})





penghasilan.addEventListener("click", () => {
    console.log("hai")
})