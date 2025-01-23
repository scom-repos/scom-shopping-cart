import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

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

export const buttonStyle = Styles.style({
    width: 'auto',
    minWidth: 180,
    marginTop: '1rem',
    marginInline: 'auto',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    color: Theme.colors.primary.contrastText,
    background: Theme.colors.primary.main,
    borderRadius: 12
})