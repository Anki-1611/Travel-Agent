import { Button } from "@mui/material";
import { sendWhatsAppMessage } from "@/app/services/travelService";
import { getPassengersForTrip } from "@/app/services/travelService";

const ShareWhatsAppButton = ({ tripId }: { tripId: string }) => {
  const handleShare = async () => {
    try {
      const passengers = await getPassengersForTrip(tripId);
      const phoneNumbers = passengers.map(p => p.phone);

      const message = `Hello! Please update your details for the trip.`;
      sendWhatsAppMessage(phoneNumbers, message);
    } catch (error) {
      console.error("Failed to fetch passengers or send message:", error);
    }
  };

  return (
    <Button variant="contained" color="success" onClick={handleShare}>
      Share via WhatsApp
    </Button>
  );
};

export default ShareWhatsAppButton;
