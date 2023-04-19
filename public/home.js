const penghasilan = document.querySelector("#penghasilan")
const pendapatan = document.querySelector("#pendapatan")
const kegiatanCreate = document.querySelector("#kegiatanCreate")
const pendapatanCreate = document.querySelector("#pendapatanCreate")
const tutupModal = document.querySelector("#tutupModal")



document.addEventListener("click", (e) => {

    if (e.target.id === "perbaiki") {
        const kontenKiri = document.querySelectorAll(".kontenKiri")
        console.log(kontenKiri[0])
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
        tidakDiperbaiki()
    }

    if (e.target.classList.contains("submitCreate")) {
        Create(e.target)
    }


})





penghasilan.addEventListener("click", () => {
    console.log("hai")
})



// function 
function tidakDiperbaiki () {
    const diperbaiki = document.querySelector("#diperbaiki")
    if(!diperbaiki){
        return false;
    }
    const kontenKiri = document.querySelectorAll(".kontenKiri")
        for (kontenkiris of kontenKiri) {
            kontenkiris.innerHTML = kontenkiris.getAttribute("data-harga")
        }
        diperbaiki.removeAttribute("data-harga");
        diperbaiki.setAttribute("id", "perbaiki")
}

function Create (target) {
    let total = document.querySelector("#total")
        const opsi = target.getAttribute("data-opsi");
        const formCreate = document.querySelector("#formCreate");
        const pertamaKegiatan = document.querySelector("#pertamaKegiatan")
        const wadahPendapatan = document.querySelector("#wadahPendapatan")
        if (kegiatanCreate.value === "") {
            kegiatanCreate.setAttribute("placeholder", "Kegiatan Wajib Di isi")
            return false
        }
        if (pendapatanCreate.value === "") {
            pendapatanCreate.setAttribute("placeholder", "Pendapatan Wajib di isi")
            return false
        }
        fetch("/home", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    kegiatan: kegiatanCreate.value,
                    pendapatan: pendapatanCreate.value,
                    opsi,
                }
            )
        })
        .finally(() => {
            tidakDiperbaiki();
            tutupModal.click();
        })
        .then(() => {
            if(total.innerHTML === "0"){
                wadahPendapatan.innerHTML = 
                `
                <div class="rounded mt-2 px-2 pb-1 d-flex justify-content-between" id="pertamaKegiatan" style="background-color: #${(opsi === "untung") ? '68B984' : 'F15A59'};box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
                    <h6 class="my-1">${kegiatanCreate.value}</h6>
                    <h6 class="kontenKiri text-light my-1">${ (opsi === "untung") ? '<i class="bi bi-arrow-up"></i></i>' : '<i class="bi bi-arrow-down"></i></i>' } ${Number(pendapatanCreate.value).toLocaleString("id-ID",{style:"currency",currency:"IDR"})}</h6>
                </div>
                `
                total.innerHTML = Number(total.innerHTML) + 1;
                return;
            }
            total.innerHTML = Number(total.innerHTML) + 1;
            const div = document.createElement("div");
            div.setAttribute("id","pertamaKegiatan")
            div.innerHTML = 
            `
            <div class="rounded mt-2 px-2 pb-1 d-flex justify-content-between" style="background-color: #${(opsi === "untung") ? '68B984' : 'F15A59'};box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
            <h6 class="my-1">${kegiatanCreate.value}</h6>
            <h6 class="kontenKiri text-light my-1">${ (opsi === "untung") ? '<i class="bi bi-arrow-up"></i></i>' : '<i class="bi bi-arrow-down"></i></i>' } ${Number(pendapatanCreate.value).toLocaleString("id-ID",{style:"currency",currency:"IDR"})}</h6>
            </div>
            `
            wadahPendapatan.insertBefore(div,pertamaKegiatan);
            pertamaKegiatan.removeAttribute("id")
            formCreate.reset();
        })    
}