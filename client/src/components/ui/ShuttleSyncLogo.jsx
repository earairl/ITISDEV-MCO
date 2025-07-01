import logo from '../../assets/shuttlesync.png';

function ShuttleSyncLogo(props) {
    return (
        <>
            <div className={props.styles.shuttlesync}>
                <img src={logo} alt="ShuttleSync Logo" />
            </div>
        </>
    )
}

export { ShuttleSyncLogo }