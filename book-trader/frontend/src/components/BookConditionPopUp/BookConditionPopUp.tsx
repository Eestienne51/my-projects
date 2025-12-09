import "./BookConditionPopUp.css";

interface BookConditionPopUpProps {
    onClose: () => void;
}


export default function BookConditionPopUp({ onClose }: BookConditionPopUpProps) {
    return (
        <div className="condition-popup-background">
            <div className="condition-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="x-button" onClick={onClose}>
                    ×
                </button>
                
                <h2>Book Condition Guide</h2>
                
                <div className="condition-list">
                    <div className="condition-item">
                        <h3>As New / New</h3>
                        <p>The book is in perfect, flawless condition, as if it were never used. It may still be in the original shrink-wrap.</p>
                    </div>

                    <div className="condition-item">
                        <h3>Fine</h3>
                        <p>The book is nearly new but not quite crisp. It may show very minor signs of handling, but pages are clean and unmarked.</p>
                    </div>

                    <div className="condition-item">
                        <h3>Near Fine</h3>
                        <p>A book that is almost fine but has a couple of very minor, specific defects that a seller should note.</p>
                    </div>

                    <div className="condition-item">
                        <h3>Very Good</h3>
                        <p>Shows some signs of wear, but the book is still attractive. There should be no tears on the binding or paper, but there might be light shelf wear or a former owner's name.</p>
                    </div>

                    <div className="condition-item">
                        <h3>Good</h3>
                        <p>A readable book that shows more noticeable wear than a VG copy. It may have highlighting, a loose binding, or a torn dust jacket, but all pages are intact.</p>
                    </div>

                    <div className="condition-item">
                        <h3>Fair</h3>
                        <p>The book is well-worn, but all the text pages are present and readable. It might be missing endpapers or the half-title page, and the binding may be weak.</p>
                    </div>

                    <div className="condition-item">
                        <h3>Poor</h3>
                        <p>A heavily worn book where the primary value is the legible text. It may have significant damage, such as missing pages or a damaged binding. This is often called a "reading copy" and is not suitable for collecting.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}