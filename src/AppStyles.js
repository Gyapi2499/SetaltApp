import {makeStyles} from "@material-ui/core/styles";

const appStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        marginLeft: theme.spacing(1),
        flexGrow: 1,
    },
    search:{
        marginTop: theme.spacing(10),
    },
    terkepFolott:{
        marginTop: theme.spacing(4),
    },
    udvozloAlatt:{
        marginBottom: theme.spacing(4),
    },
    inputAlatt:{
        marginTop: theme.spacing(5),
        textAlign: "center",
    },
    kozepre:{
        textAlign: "center",
    },
    searchForm:{
        display:"flex",
        width: 100 + '%',
        padding: 0.5 + 'rem',
        fontSize: 1 + 'rem'
    },
    loading: {
        display: 'flex',
        marginTop: theme.spacing(40),
        marginLeft: 47 + '%'
    },
}));

export default appStyles;