import { Styles } from "@ijstech/components";

export const textRight = Styles.style({
    textAlign: 'right'
})

export const inputStyle = Styles.style({
    $nest: {
        'input': {
            textAlign: 'center',
            border: 'none'
        }
    }
})

export const alertStyle = Styles.style({
    $nest: {
        'i-vstack i-label': {
            textAlign: 'center'
        },
        'span': {
            display: 'inline'
        }
    }
})

export const textEllipsis = Styles.style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    WebkitBoxOrient: 'vertical',
})