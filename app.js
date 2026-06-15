let canciones = [
    {
        titulo: "Emir Sensini Medley",
        acordes: "Sol Do Re Mim Re"
    },
    {
        titulo: "Solo Tu",
        acordes: "Mi Sol# La Si"
    },
    {
        titulo: "Tu Fidelidad",
        acordes: "Mi La Si Mi"
    }
];

function mostrarCanciones() {

    let lista = document.getElementById("listaCanciones");

    lista.innerHTML = "";

    canciones.forEach((cancion,index)=>{

        lista.innerHTML += `
        <div class="cancion">
            <h3>${cancion.titulo}</h3>
            <pre>${cancion.acordes}</pre>
        </div>
        `;
    });

}

function agregarCancion(){

    let titulo = prompt("Nombre de la canción");

    let acordes = prompt("Acordes");

    if(titulo && acordes){

        canciones.push({
            titulo,
            acordes
        });

        mostrarCanciones();
    }
}

document.getElementById("buscador").addEventListener("keyup",function(){

    let texto = this.value.toLowerCase();

    let filtradas = canciones.filter(c =>
        c.titulo.toLowerCase().includes(texto)
    );

    let lista = document.getElementById("listaCanciones");

    lista.innerHTML = "";

    filtradas.forEach(cancion=>{

        lista.innerHTML += `
        <div class="cancion">
            <h3>${cancion.titulo}</h3>
            <pre>${cancion.acordes}</pre>
        </div>
        `;
    });

});

mostrarCanciones();