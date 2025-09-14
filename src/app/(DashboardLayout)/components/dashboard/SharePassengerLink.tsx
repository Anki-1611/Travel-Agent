import {
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";

const SharePassengerLink = ({ tripId, tripName }: { tripId: string; tripName: string }) => {
  const shareUrl = `${window.location.origin}/passenger/create-passanger?tripId=${tripId}&tripName=${encodeURIComponent(tripName)}`;

  return (
    <div style={{ display: "flex", gap: "10px",alignItems:'center',justifyContent:'center',marginTop:'10px' }}>
      <WhatsappShareButton url={shareUrl} title={`Please fill your details for trip ${tripName}`}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>
    </div>
  );
};

export default SharePassengerLink;
