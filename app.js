import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCz2OqTitzVydRQrK3sJDoeE6ZELLmSBX0",
    authDomain: "vamos-a-adorar.firebaseapp.com",
    projectId: "vamos-a-adorar",
    storageBucket: "vamos-a-adorar.firebasestorage.app",
    messagingSenderId: "393477843732",
    appId: "1:393477843732:web:e030649e106bb50191b001"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const ADMIN_EMAIL = "cristiancachagua@gmail.com";

let esAdmin = false;
let canciones = [];

/* ==========================
   CARGAR CANCIONES
========================== */

async function cargarCanciones() {

    canciones = [];

    const querySnapshot = await getDocs(
        collection(db, "canciones")
    );

    querySnapshot.forEach((documento) => {

        canciones.push({
            id: documento.id,
            ...documento.data()
        });

    });

    mostrarCanciones();
}

/* ==========================
   MOSTRAR CANCIONES
========================== */

function mostrarCanciones() {

    const lista = document.getElementById("listaCanciones");

    lista.innerHTML = "";

    canciones.forEach((cancion) => {

        lista.innerHTML += `
        <div class="cancion">

            <h3>${cancion.titulo}</h3>

            <pre>${cancion.acordes}</pre>

            ${
                esAdmin
                ? `
                    <button onclick="editarCancion('${cancion.id}')">
                        Editar
                    </button>

                    <button onclick="eliminarCancion('${cancion.id}')">
                        Eliminar
                    </button>
                  `
                : ""
            }

        </div>
        `;
    });
}

/* ==========================
   AGREGAR
========================== */

async function agregarCancion() {

    if (!esAdmin) return;

    const titulo = prompt("Nombre de la canción");

    if (!titulo) return;

    const acordes = prompt("Acordes");

    if (!acordes) return;

    await addDoc(
        collection(db, "canciones"),
        {
            titulo,
            acordes
        }
    );

    cargarCanciones();
}

/* ==========================
   ELIMINAR
========================== */

async function eliminarCancion(id) {

    if (!confirm("¿Eliminar esta canción?")) return;

    await deleteDoc(
        doc(db, "canciones", id)
    );

    cargarCanciones();
}

/* ==========================
   EDITAR
========================== */

async function editarCancion(id) {

    const cancion = canciones.find(
        c => c.id === id
    );

    if (!cancion) return;

    const nuevoTitulo = prompt(
        "Nuevo título",
        cancion.titulo
    );

    if (!nuevoTitulo) return;

    const nuevosAcordes = prompt(
        "Nuevos acordes",
        cancion.acordes
    );

    if (!nuevosAcordes) return;

    await updateDoc(
        doc(db, "canciones", id),
        {
            titulo: nuevoTitulo,
            acordes: nuevosAcordes
        }
    );

    cargarCanciones();
}

/* ==========================
   BUSCADOR
========================== */

document.getElementById("buscador")
.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filtradas = canciones.filter(
        c => c.titulo.toLowerCase().includes(texto)
    );

    const lista = document.getElementById("listaCanciones");

    lista.innerHTML = "";

    filtradas.forEach((cancion) => {

        lista.innerHTML += `
        <div class="cancion">

            <h3>${cancion.titulo}</h3>

            <pre>${cancion.acordes}</pre>

            ${
                esAdmin
                ? `
                    <button onclick="editarCancion('${cancion.id}')">
                        Editar
                    </button>

                    <button onclick="eliminarCancion('${cancion.id}')">
                        Eliminar
                    </button>
                  `
                : ""
            }

        </div>
        `;
    });

});

/* ==========================
   LOGIN GOOGLE
========================== */

document.getElementById("loginBtn")
.addEventListener("click", async () => {

    try {

        await signInWithPopup(
            auth,
            provider
        );

    } catch (error) {

        console.error(error);

    }

});

/* ==========================
   LOGOUT
========================== */

document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

});

/* ==========================
   ESTADO LOGIN
========================== */

onAuthStateChanged(auth, (user) => {

    const btnAgregar =
        document.getElementById("btnAgregar");

    const loginBtn =
        document.getElementById("loginBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (!user) {

        esAdmin = false;

        btnAgregar.style.display = "none";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";

        mostrarCanciones();

        return;
    }

    esAdmin =
        user.email === ADMIN_EMAIL;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    btnAgregar.style.display =
        esAdmin
            ? "inline-block"
            : "none";

    mostrarCanciones();
});

/* ==========================
   FUNCIONES GLOBALES
========================== */

window.agregarCancion = agregarCancion;
window.editarCancion = editarCancion;
window.eliminarCancion = eliminarCancion;

/* ==========================
   INICIO
========================== */

cargarCanciones();