function AlertModal(props) {
    return (
        <div class="modal" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
            <div class="glass-alert">
                <div class="alert-icon-box">
                    <ion-icon name="notifications"></ion-icon>
                </div>
                <h3>Notification</h3>
                <p>{props.message}</p>
                <button class="alert-btn" onClick={props.onClose}>Got it</button>
            </div>
        </div>
    );
}

export default AlertModal;
