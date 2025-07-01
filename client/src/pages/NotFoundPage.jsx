import NotFoundIcon from "../assets/PageNotFound.png";
import styles from "./NotFoundPage.module.css";
import { motion } from 'motion/react'


function NotFoundPage() {
    return (
        <motion.div 
            className={styles.MainDiv}

            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <img src={NotFoundIcon} alt="Page Not Found" />
            <h1>PAGE NOT FOUND</h1>
            <h2> Sorry, but it seems this page does not exist. Kindly check if the URL is correct.</h2>
            <h2>- The Meownager (•ㅅ•)</h2>
        </motion.div>
    )
}

export default NotFoundPage