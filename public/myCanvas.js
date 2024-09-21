// Obtenez le canvas et son contexte de dessin
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Définir les dimensions du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Tableau pour stocker les cercles lumineux actifs
var lightCircles = [];

// Variable pour stocker la position de la souris
var mousePos = null;

// Fonction de dessin pour les cercles lumineux
function drawLightCircle(x, y, size) {
    // Créer un gradient radial pour le cercle lumineux
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    // Dessiner le cercle lumineux
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
}

// Calculer la distance entre deux points
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Générer des cercles aléatoires
for (var i = 0; i < 100; i++) {
    // Générer une position aléatoire pour le cercle lumineux
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;

    // Générer une taille aléatoire pour le cercle lumineux
    var size = Math.random() < 0.1 ? 25 : 15; // 10% des cercles sont grands, 90% des cercles sont petits

    // Ajouter le cercle lumineux au tableau
    lightCircles.push({ x: x, y: y, dx: (2 * Math.random() - 1) / 1, dy: (2 * Math.random() - 1) / 8, size: size, fuite: false, fuite_start_time: 0 });
}


// Faire bouger les cercles de manière aléatoire et éviter les collisions 
function moveLightCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < lightCircles.length; i++) {
        var circle = lightCircles[i];

        // Vérifier si le cercle doit fuir la souris
        if (mousePos && distance(circle.x, circle.y, mousePos.x, mousePos.y) < 100) {
            circle.fuite = true;
            circle.fuite_start_time = new Date().getTime();
            // Mémoriser la direction actuelle du cercle
            circle.direction = { dx: circle.dx, dy: circle.dy };
            // Déterminer la direction opposée à la souris
            var dx = circle.x - mousePos.x;
            var dy = circle.y - mousePos.y;
            var norme = Math.sqrt(dx * dx + dy * dy);
            if (norme > 0) {
                dx /= norme;
                dy /= norme;
            }
            // Conserver cette direction pour la suite
            circle.fuite_direction = { dx: dx, dy: dy };
        }

        // Calculer la nouvelle position du cercle
        if (circle.fuite) {
            // Déplacer rapidement dans la direction opposée à la souris
            var vitesse = 2;
            circle.x += circle.fuite_direction.dx * vitesse;
            circle.y += circle.fuite_direction.dy * vitesse;

            // Si la fuite a duré plus de 0,005 seconde, arrêter la fuite
            if (new Date().getTime() - circle.fuite_start_time > 5) {
                circle.fuite = false;
                // Utiliser la direction de fuite comme nouvelle direction
                circle.dx = circle.fuite_direction.dx;
                circle.dy = circle.fuite_direction.dy;
            }
        } else {
            circle.x += circle.dx;
            circle.y += circle.dy;

            // Vérifier si le cercle est sorti du canvas, et le faire apparaître à l'opposé
            if (circle.x + circle.size / 2 <= 0) {
                circle.x = canvas.width + circle.size / 2;
            } else if (circle.x - circle.size / 2 >= canvas.width) {
                circle.x = -circle.size / 2;
            }
            if (circle.y + circle.size / 2 <= 0) {
                circle.y = canvas.height + circle.size / 2;
            } else if (circle.y - circle.size / 2 >= canvas.height) {
                circle.y = -circle.size / 2;
            }
        }

        drawLightCircle(circle.x, circle.y, circle.size);
    }

    requestAnimationFrame(moveLightCircles);
}

moveLightCircles();


// Faire scintiller les cercles aléatoirement
function flickerLightCircles() {
    for (var i = 0; i < lightCircles.length; i++) {
        var circle = lightCircles[i];
        var flicker = Math.random();
        if (flicker < 0.4) { // 40% des cercles scintillent à chaque itération
            drawLightCircle(circle.x, circle.y, circle.size * (1 + flicker)); // Dessiner un cercle lumineux plus grand et plus brillant
        } else {
            drawLightCircle(circle.x, circle.y, circle.size); // Dessiner un cercle lumineux normal
        }
    }
    setTimeout(flickerLightCircles, 50); // Rappeler cette fonction toutes les 50 ms pour une animation continue
}

flickerLightCircles();

// Ajouter un gestionnaire d'événements de souris pour suivre la position de la souris
canvas.addEventListener('mousemove', function (e) {
    mousePos = getMousePos(canvas, e);
});

// Fonction pour obtenir la position de la souris relative au canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}