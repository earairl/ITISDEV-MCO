import NotFoundIcon from "../assets/PageNotFound.png";
import styles from "./NotFoundPage.module.css";


function NotFoundPage() {
    return (
        <div className={styles.MainDiv}>
            <img src={NotFoundIcon} alt="Page Not Found" />
            <h1>PAGE NOT FOUND</h1>
            <h2> Sorry, but it seems this page does not exist. Kindly check if the URL is correct.</h2>
            <h2>- The Meownager (•ㅅ•)</h2>
        </div>
    )
}

export default NotFoundPage