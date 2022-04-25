import { Router } from 'express'
import rgbHex from 'rgb-hex'

const router = Router()

router.get('/discord/message', async (req, res) => {
    let { 
        username = 'Oneki', 
        avatar = 'https://cdn.discordapp.com/avatars/901956486064922624/e7d4737319365eed6d83bd29606e5872.png?size=80', 
        bot, 
        verified, 
        message = 'Hey, who are you?',
        color = '#62a4c7'
    } = req.query
    message = message.replace(/</gi, '&#60;').replace(/>/gi, '&#62;')
    const users = message.match(/&#60;@!?\d{18}&#62;/gi)
    if (users) {
        for (const m of users) {
            const user = await fetchUser(m.replace(/&#60;@!?/, '').replace('&#62;', ''))
            if (user && !user.message) message = message.replace(m, `<span class="mention wrapper-1ZcZW- mention interactive" aria-controls="popout_558" aria-expanded="false" tabindex="0" role="button">@${user.username}</span>`)
        }
    }
    const emojis = message.match(/&#60;a?:[a-z_]+:\d{18}&#62;/gi)
    console.log(emojis)
    if (emojis) {
        for (const m of emojis) {
            const emoji = await fetchEmoji(m.replace(/&#60;a?:/, '').replace('&#62;', ''))
            // console.log(emoji)
        //     if (emoji && !emoji.message) message = message.replace(m, `:${emoji.name}:`)
        }
    }
    res.render('fake/discord/message', {
        layout: false,
        username,
        avatar,
        message,
        color: processColor(color),
        bot: Object.values(req.query).length > 0 ? isBotVerified(bot, verified) : isBotVerified(true, true),
    })
})

function isBotVerified(bot, verified) {
    if (typeof bot === 'undefined') return ''
    if (typeof verified === 'undefined')
        return '<span class="botTagCozy-3NTBvK botTag-1NoD0B botTagRegular-kpctgU botTag-7aX5WZ rem-3kT9wc"><span class="botText-1fD6Qk">BOT</span></span>'
    return '<span class="botTagCozy-3NTBvK botTag-1NoD0B botTagRegular-kpctgU botTag-7aX5WZ rem-3kT9wc"><svg aria-label="Bot verificado" class="botTagVerified-2KCPMa" aria-hidden="false" width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg><span class="botText-1fD6Qk">BOT</span></span>'
}

/**
 * 
 * @param {string} color 
 */
function processColor(color) {
    console.log('color', color);
    if ((/(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/i)) {
        if (color.startsWith('#')) return color.slice(1)
        else if(color.startsWith('0x')) return color.slice(2)
        else if(color.startsWith('rgb')) return rgbHex(color)
        else return '62a4c7"'
    }
    else return '62a4c7"'
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<object>}
 */
async function fetchUser(id) {
    const res = await fetch(`https://discord.com/api/v9/users/${id}`, {
        headers: {
            'Authorization': 'Bot ' + process.env.TOKEN_DISCORD,
        }
    })
    if (res.ok) return res.json()
    else return { message: 'User not found' }
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<object>}
 */
async function fetchEmoji(id) {
    const res = await fetch(`https://cdn.discordapp.com/emojis/${id}ssdfsdf.png}`, {
        headers: {
            'Authorization': 'Bot ' + process.env.TOKEN_DISCORD,
        }
    })
    console.log(res.status);
    if (res.status != 200) return { message: 'Emoji not found' }
    else return { url: `https://cdn.discordapp.com/emojis/${id}.png`}
}

export { router as fake }
