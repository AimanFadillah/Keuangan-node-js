const penghasilan = document.querySelector("#penghasilan")
const pendapatan = document.querySelector("#pendapatan")
const containerPendapatan = document.querySelector("#containerPendapatan")
const containerPenghasilan = document.querySelector("#containerPenghasilan")
const kegiatanCreate = document.querySelector("#kegiatanCreate")
const pendapatanCreate = document.querySelector("#pendapatanCreate")
const tutupModal = document.querySelector("#tutupModal")
const bodyHapus = document.querySelector("#bodyHapus")
const wadahPendapatan = document.querySelector("#wadahPendapatan")
const bodyEdit = document.querySelector("#bodyEdit")
let total = document.querySelector("#total")
const tabungan = document.querySelector("#tabungan")
const nyalaButton = document.querySelectorAll(".nyalaButton")

penghasilan.addEventListener("click", () => {
    TampilkanPenghasilan();
})

pendapatan.addEventListener("click", () => {
    TampilkanPendapatan();
})

for (nyala of nyalaButton) {
    const tipe = nyala.getAttribute("data-pendapatan")
    savePenghasilan(tipe);
}

document.addEventListener("click", (e) => {

    if (e.target.id === "perbaiki") {
        diperbaiki(e.target)
    } else if (e.target.id === "diperbaiki") {
        tidakDiperbaiki()
    }

    if (e.target.classList.contains("submitCreate")) {
        Create(e.target)
    }

    if (e.target.classList.contains("hapusPendapatan")) {
        modalHapusPendapatan(e.target)
    }

    if (e.target.id === "yesHapusPendapatan") {
        HapusKegiatan(e.target);
    }

    if (e.target.classList.contains("editPendapatan")) {
        editPendapatan(e.target)
    }

    if (e.target.classList.contains("submitEditButton")) {
        updateKegiatan(e.target)
    }

    if (e.target.classList.contains("powerPendapatan")) {
        const tipe = e.target.getAttribute("data-pendapatan")
        NyalaPenghasilan(tipe)
        savePenghasilan(tipe)
    }

    if (e.target.classList.contains("offPendapatan")) {
        const tipe = e.target.getAttribute("data-pendapatan")
        MatikanPenghasilan(tipe);
    }

    if (e.target.classList.contains("savePendapatan")) {
        const tipe = e.target.getAttribute("data-pendapatan");
        simpanPenghasilan(tipe,e.target)
    }

})

// FUNCTION FUNCTION 
function TampilkanPendapatan () {
    pendapatan.setAttribute("style", "width: 100%;background-color: #917FB3;color: white;")
    penghasilan.setAttribute("style", "width: 100%;border:1px #917FB3 solid;border-bottom: 0px;")
    containerPendapatan.style.display = "block";
    containerPenghasilan.style.display = "none";
}

function TampilkanPenghasilan () {
    penghasilan.setAttribute("style", "width: 100%;background-color: #917FB3;color: white;")
    pendapatan.setAttribute("style", "width: 100%;border:1px #917FB3 solid;border-bottom: 0px;")
    containerPendapatan.style.display = "none";
    containerPenghasilan.style.display = "block";
}

function NyalaPenghasilan(tipe) {
    const wadah = document.querySelector(`#side${tipe}`)
    wadah.innerHTML =
        `
        <input type="number" class="form-control p-0 px-1" placeholder="${tipe}" style="box-shadow:rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset; ;border: none;width: 50%;" class="rounded" name="${tipe}" id="input${tipe}" >
        <button data-pendapatan="${tipe}" id="buttonTipe${tipe}" class="offPendapatan badge bg-danger ms-2 border-0 py-1" style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
          <i data-pendapatan="${tipe}" class="offPendapatan bi bi-power"></i>
        </button>
        `
}

function MatikanPenghasilan(tipe){
    const wadah = document.querySelector(`#side${tipe}`)
    fetch(`/penghasilan?update${tipe}=true`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                isi: 0,
            }
        )
    })
        .then(() => {
            wadah.innerHTML =
                `
        <button data-pendapatan="${tipe}" class="powerPendapatan badge bg-danger ms-2 border-0 py-1" style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
          <i data-pendapatan="${tipe}" class="powerPendapatan bi bi-power"></i>
        </button>
        `
        })
}

function simpanPenghasilan(tipe,target){
    const button = document.querySelector(`#buttonTipe${tipe}`)
    button.innerHTML = `<i class="bi bi-arrow-clockwise"></i>`;
    fetch(`/penghasilan?update${tipe}=true`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                isi: target.getAttribute("data-isi"),
            }
        )
    })
        .then(() => {
            button.innerHTML = `<i data-pendapatan="${tipe}" class="offPendapatan bi bi-power"></i>`
            if (button.classList.contains("savePendapatan")) {
                button.classList.remove("savePendapatan")
                button.classList.add("offPendapatan");
            }
            if (button.classList.contains("bg-danger")) {
                button.classList.remove("bg-danger")
                button.classList.add("bg-success")
            }
        })
}


function savePenghasilan(tipe) {
    const input = document.querySelector(`#input${tipe}`);
    const button = document.querySelector(`#buttonTipe${tipe}`)

    input.addEventListener("keyup", () => {

        if (input.value === "") {
            if (button.classList.contains("bg-success")) {
                button.classList.remove("bg-success")
                button.classList.add("bg-danger")
                button.innerHTML = `<i data-pendapatan="${tipe}" class="offPendapatan bi bi-power"></i>`
            }
            if (button.classList.contains("savePendapatan")) {
                button.classList.remove("savePendapatan")
                button.classList.add("offPendapatan");
            }
            return false;
        }

        button.classList.remove("bg-danger")
        button.classList.add("bg-success")
        button.innerHTML = `<i data-pendapatan="${tipe}" data-isi="${input.value}" class="savePendapatan bi bi-check2"></i>`
        if (button.classList.contains("offPendapatan")) {
            button.classList.remove("offPendapatan")
            button.classList.add("savePendapatan");
        }

    })
}



function diperbaiki(target) {
    const kontenKiri = document.querySelectorAll(".kontenKiri")

    for (kontenkiris of kontenKiri) {
        kontenkiris.setAttribute("data-harga", kontenkiris.innerHTML);
        const id = kontenkiris.getAttribute("data-id")
        kontenkiris.innerHTML =
            `
        <div data-id="${id}" class="editPendapatan badge bg-primary me-1" data-bs-toggle="modal" data-bs-target="#modalEdit" style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;" ><i class="editPendapatan bi bi-pencil-square"  data-id="${id}" ></i> Edit</div>
        <div data-id="${id}" class="hapusPendapatan badge bg-danger" data-bs-toggle="modal" data-bs-target="#modalHapus"  style="box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;"><i class="hapusPendapatan bi bi-trash-fill"  data-id="${id}"></i> Hapus</div>
        `
    }
    target.setAttribute("id", "diperbaiki")
}


function tidakDiperbaiki() {
    const diperbaiki = document.querySelector("#diperbaiki")
    if (!diperbaiki) {
        return false;
    }
    const kontenKiri = document.querySelectorAll(".kontenKiri")
    for (kontenkiris of kontenKiri) {
        kontenkiris.innerHTML = kontenkiris.getAttribute("data-harga")
    }
    diperbaiki.removeAttribute("data-harga");
    diperbaiki.setAttribute("id", "perbaiki")
}

function modalHapusPendapatan(target) {
    const id = target.getAttribute("data-id");
    bodyHapus.innerHTML =
        `
    <small style="text-align: center;">Jika anda menghapus ini maka akan mempengaruhi isi tabungan</small>
        <div class="d-flex mt-3 justify-content-between">
          <button class="btn btn-danger" id="batalHapusPendapatan" data-bs-dismiss="modal" style="width: 49%;" >Batal</button>
          <button class="btn btn-success" id="yesHapusPendapatan" data-id="${id}" style="width: 49%;" >Yakin</button>
        </div>
    </div>
    `
}

function Create(target) {
    const formCreate = document.querySelector("#formCreate");
    const pertamaKegiatan = document.querySelector("#pertamaKegiatan")
    if (kegiatanCreate.value === "") {
        kegiatanCreate.setAttribute("placeholder", "Kegiatan Wajib Di isi")
        return false
    }
    if (pendapatanCreate.value === "") {
        pendapatanCreate.setAttribute("placeholder", "Pendapatan Wajib di isi")
        return false
    }
    const opsi = target.getAttribute("data-opsi");
    let submitCreate;
    if (opsi === "untung") {
        submitCreate = document.querySelector("#createKeuntungan")
    } else {
        submitCreate = document.querySelector("#createKerugian")
    }
    submitCreate.disabled = true;
    const isisubmit = submitCreate.innerHTML
    submitCreate.innerHTML =
        `
        ${isisubmit}
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        `
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
            submitCreate.disabled = false;
            submitCreate.innerHTML = isisubmit;
            tidakDiperbaiki();
            tutupModal.click();
        })
        .then(response => response.json())
        .then(data => {
            const id = data[0]._id;
            tabungan.innerHTML = Number(data[0].pendapatan).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
            if (total.innerHTML === "0") {
                wadahPendapatan.innerHTML =
                    `
                <div class="pendapatanke${id} kegiatan rounded mt-2 px-2 pb-1 d-flex justify-content-between" id="pertamaKegiatan" style="background-color: #${(opsi === "untung") ? '68B984' : 'F15A59'};box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
                    <h6 class="my-1">${kegiatanCreate.value}</h6>
                    <h6 class="kontenKiri text-light my-1" data-id="${id}">${(opsi === "untung") ? '<i class="bi bi-arrow-up"></i></i>' : '<i class="bi bi-arrow-down"></i></i>'} ${Number(pendapatanCreate.value).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</h6>
                </div>
                `
                total.innerHTML = Number(total.innerHTML) + 1;
                formCreate.reset();
                return;
            }
            total.innerHTML = Number(total.innerHTML) + 1;
            const div = document.createElement("div");
            div.setAttribute("id", "pertamaKegiatan")
            div.classList.add("kegiatan", `pendapatanke${id}`)
            div.innerHTML =
                `
            <div class="rounded mt-2 px-2 pb-1 d-flex justify-content-between" style="background-color: #${(opsi === "untung") ? '68B984' : 'F15A59'};box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
            <h6 class="my-1">${kegiatanCreate.value}</h6>
            <h6 class="kontenKiri text-light my-1"  data-id="${id}" >${(opsi === "untung") ? '<i class="bi bi-arrow-up" ></i></i>' : '<i class="bi bi-arrow-down"></i></i>'} ${Number(pendapatanCreate.value).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</h6>
            </div>
            `
            wadahPendapatan.insertBefore(div, pertamaKegiatan);
            pertamaKegiatan.removeAttribute("id")
            formCreate.reset();
        })
}

function HapusKegiatan(target) {
    const submitDelete = target;
    const id = target.getAttribute("data-id");
    const batalHapusPendapatan = document.querySelector("#batalHapusPendapatan");
    const pendapatanke = document.querySelector(`.pendapatanke${id}`)
    submitDelete.disabled = true;
    submitDelete.innerHTML =
        `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Yakin
        `
    fetch(`/home?_method=DELETE`, {
        method: "post",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            id: id,
        })
    })
        .finally(() => {
            submitDelete.disabled = false;
            submitDelete.innerHTML =
                `
            Yakin
            `
            batalHapusPendapatan.click();
        })
        .then(response => response.json())
        .then(data => {
            tabungan.innerHTML = Number(data[0].pendapatan).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
            total.innerHTML = Number(total.innerHTML) - 1;
            if (pendapatanke.id) {
                wadahPendapatan.removeChild(pendapatanke)
                const kegiatan = document.querySelector(".kegiatan")
                if (!kegiatan) {
                    wadahPendapatan.innerHTML =
                        `
                    <div class="rounded mt-2 px-2 pb-1 d-flex justify-content-center" id="pertamaKegiatan" style="background-color: #7C96AB ;box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
                          <h5 class="my-1"><i class="bi bi-server"></i> Tidak Ada Kegiatan</h5>
                    </div>
                    `
                    tidakDiperbaiki()
                } else {
                    kegiatan.setAttribute("id", "pertamaKegiatan")
                }
            } else {
                wadahPendapatan.removeChild(pendapatanke)
            }



        })
}

function editPendapatan(target) {
    const id = target.getAttribute("data-id");
    bodyEdit.innerHTML =
        `
    <div class="d-flex justify-content-center">
        <div class="spinner-border" style="width: 3rem; height: 3rem;color:#41644A" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    fetch(`/?find=${id}`)
        .then(response => response.json())
        .then(data => {
            const kegiatanEdit = data[0];
            bodyEdit.innerHTML =
                `
        <form>
            <h3 class="text-center mb-3">Ubah Pendapatan</h3>
            <div class="mb-3">
                <label for="kegiatan" class="fw-bold form-label"><i class="bi bi-activity"></i> Kegiatan</label>
                <input type="text" value=${kegiatanEdit.kegiatan}  required class="form-control" id="kegiatanEdit" >
                <div id="note" class="form-text">Maksimal 10 huruf</div>
            </div>
            <div class="mb-3">
                <label for="pendapatan" class="fw-bold form-label"><i class="bi bi-cash"></i> Pendapatan</label>
                <input type="number" required class="form-control" value="${kegiatanEdit.pendapatan}" id="pendapatanEdit" >
            </div>
            <h6 class="text-dark fw-bold"><i class="bi bi-question-lg"></i> Opsi</h6>
            <button style="width: 100%;" data-opsi="untung" data-id="${kegiatanEdit._id}" id="editKeuntungan" class="submitEditButton btn btn-success mb-1"><i class="submitEditButton bi bi-graph-up"  data-id="${kegiatanEdit._id}"></i> Keuntungan</button>
            <button style="width: 100%;" data-opsi="rugi"   data-id="${kegiatanEdit._id}" id="editKerugiann" class="submitEditButton btn btn-danger"><i class="submitEditButton bi bi-graph-down"  data-id="${kegiatanEdit._id}" ></i> Kerugian</button>
        </form>
        <button id="tutupModalEdit" data-bs-dismiss="modal"  style="border: none;background: none" ></button>
        `
        })
}


function updateKegiatan(target) {
    const id = target.getAttribute("data-id")
    const kegiatanEdit = document.querySelector("#kegiatanEdit")
    const tutupModalEdit = document.querySelector("#tutupModalEdit")
    const pendapatanEdit = document.querySelector("#pendapatanEdit")
    const pendapatanke = document.querySelector(`.pendapatanke${id}`)
    const opsi = target.getAttribute("data-opsi")
    let submitEdit;
    if (kegiatanEdit.value === "") {
        kegiatanEdit.setAttribute("placeholder", "Kegiatan Wajib Di isi")
        return false
    }
    if (pendapatanEdit.value === "") {
        pendapatanEdit.setAttribute("placeholder", "Pendapatan Wajib di isi")
        return false
    }
    if (opsi === "untung") {
        submitEdit = document.querySelector("#editKeuntungan")
    } else {
        submitEdit = document.querySelector("#editKerugiann")
    }
    submitEdit.disabled = true;
    const isiSubmit = submitEdit.innerHTML;
    submitEdit.innerHTML =
        `
    ${isiSubmit}
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    `
    fetch("/home?_method=PUT", {
        method: "post",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            id: id,
            kegiatan: kegiatanEdit.value,
            pendapatan: pendapatanEdit.value,
            opsi,
        })
    })
        .finally(() => {
            tutupModalEdit.click()
            tidakDiperbaiki()
        })
        .then(response => response.json())
        .then(data => {
            tabungan.innerHTML = Number(data).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
            pendapatanke.innerHTML =
                `
        <div class="rounded mt-2 px-2 pb-1 d-flex justify-content-between"
        style="background-color: ${opsi === "untung" ? "#68B984" : "#F15A59"};box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;">
        <h6 class="my-1"  >${kegiatanEdit.value}</h6>
            <h6 class="kontenKiri text-light my-1" data-id="${id}">
                ${opsi === "untung" ? " <i class='bi bi-arrow-up'></i>" : "<i class='bi bi-arrow-down'></i>"}
                ${Number(pendapatanEdit.value).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </h6>
        </div>
        `
        })
}