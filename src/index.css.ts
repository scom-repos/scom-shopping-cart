import { Styles } from "@ijstech/components";

export const textRight = Styles.style({
    textAlign: 'right'
})

export const textEllipsis = Styles.style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    WebkitBoxOrient: 'vertical',
})