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
    width: '100%',
    maxWidth: 180,
    minWidth: 90,
    marginTop: '1rem',
    marginInline: 'auto',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    color: Theme.colors.primary.contrastText,
    background: Theme.colors.primary.main,
    borderRadius: 12
})

export const productListStyle = Styles.style({
    display: 'block !important',
    maxHeight: 'calc(100vh - 240px)',
    overflow: 'auto',
    paddingRight: '0.25rem',
    $nest: {
        '&::-webkit-scrollbar-track': {
            borderRadius: '12px',
            border: '1px solid transparent',
            backgroundColor: 'unset'
        },
        '&::-webkit-scrollbar': {
            height: '8px',
            width: '8px',
            backgroundColor: 'unset'
        },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: '12px',
            background: '#63666A 0% 0% no-repeat padding-box'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#808080 0% 0% no-repeat padding-box'
        },
    }
})