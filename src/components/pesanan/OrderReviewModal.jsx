import ReviewModalShell from "./reviewmodal/ReviewModalShell.jsx";
import ReviewHeader from "./reviewmodal/ReviewHeader.jsx";
import ReviewProduct from "./reviewmodal/ReviewProduct.jsx";
import RatingStars from "./reviewmodal/RatingStars.jsx";
import ReviewCommentBox from "./reviewmodal/ReviewCommentBox.jsx";
import AlreadyReviewed from "./reviewmodal/AlreadyReviewed.jsx";
import ReviewError from "./reviewmodal/ReviewError.jsx";
import ReviewActions from "./reviewmodal/ReviewActions.jsx";

export default function OrderReviewModal({
    showReviewModal,
    closeReviewModal,
    selectedProduct,
    selectedOrder,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    reviewError,
    reviewLoading,
    submitReview,
    reviewChecking,
    alreadyReviewed,
}) {
    if (!showReviewModal) return null;

    const canSubmit =
        !reviewLoading &&
        !reviewChecking &&
        !alreadyReviewed &&
        reviewRating > 0 &&
        reviewComment.trim().length >= 10;

    return (
        <ReviewModalShell show={showReviewModal} onClose={closeReviewModal}>
            <ReviewHeader onClose={closeReviewModal} disabled={reviewLoading} />

            <div className="p-5 space-y-5">
                <ReviewProduct product={selectedProduct} order={selectedOrder} />

                <RatingStars
                    rating={reviewRating}
                    onRatingChange={setReviewRating}
                    disabled={reviewLoading}
                />

                <ReviewCommentBox
                    value={reviewComment}
                    onChange={setReviewComment}
                    disabled={reviewLoading}
                />

                <AlreadyReviewed alreadyReviewed={alreadyReviewed} checking={reviewChecking} />

                <ReviewError error={reviewError} />

                <ReviewActions
                    onClose={closeReviewModal}
                    onSubmit={submitReview}
                    loading={reviewLoading}
                    disabled={!canSubmit}
                />

                <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
                    Ulasan Anda akan membantu pembeli lain memilih produk yang tepat.
                </p>
            </div>
        </ReviewModalShell>
    );
}
