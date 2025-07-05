export function GuestLoginBtn(props) {
    const styles = props.styles
    const navigate = props.navigate
    const showToast = props.showToast

    return (
        <button 
            className={styles.guestBtn} 
            onClick={() => {
            navigate('/games')
            showToast({
                description: 'Logged in as guest',
            })
            }}
        >
            <span className="material-symbols-outlined">
            account_circle
            </span>
            Login as Guest
        </button>
    )
}