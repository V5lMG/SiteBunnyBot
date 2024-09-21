
// recupération des tokens
const fragment = new URLSearchParams(window.location.hash.slice(1));
const [accessToken, tokeType] = [fragment.get('access_token'), fragment.get('token_type')]

// token pour les requetes
let secretUser = `${tokeType} ${accessToken}`

//recupération des infos de base de l'user (pseudo, pp, etc)
fetch('https://discord.com/api/users/@me', {
    headers: {
        authorization: `${secretUser}`,
    },
})
    .then(result => result.json())
    .then((response) => {
        const { username, discriminator, avatar, id } = response;

        // injection du pseudo du user en html
        document.getElementById('name').innerText = `Vous êtes connecté en tant que : ${username}#${discriminator}`;

    })