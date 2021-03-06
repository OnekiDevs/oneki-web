import passport from '../passport.js'
import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
    res.render('index', {
        user: req.user
    })
})

router.get('/health', async (req, res) => {
    res.send('OK')
})

router.get('/commands', async (req, res) => {
    res.render('commands', {
        user: req.user,
        commands: []
    })
})

router.get('/poll/:id', async (req, res) => {
    const snap = await db.collection('polls').doc(req.params.id).get()
    if (!snap.exists) res.status(404).send('Poll Not found')
    const author = await fetch(`https://discord.com/api/users/${req.params.id}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => res.status(500).send(err))
    if (author)
        res.render('poll', {
            user: req.user,
            poll: {
                ...snap.data(),
                id: snap.id,
                author
            }
        })
})

router.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), async (req, res) => {
    res.redirect(req.flash('redi')[0] ?? '/')
})

router.get('/invite', (req, res) => {
    res.redirect(
        'https://discord.com/api/oauth2/authorize?client_id=901956486064922624&permissions=8&redirect_uri=https%3A%2F%2Foneki.up.railway.app%2Flogin&response_type=code&scope=bot%20identify%20guilds%20applications.commands'
    )
})

// router.get('/thanks', (req, res) => {
//     if(!req.user) res.redirect('/login')
//     else res.redirect('/')
// })

router.get('/discord', (req, res) => {
    res.redirect('https://discord.gg/8SpUxnF6v4')
})

export default router
