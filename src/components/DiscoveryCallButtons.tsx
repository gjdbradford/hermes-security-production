import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Video, Calendar, AlertTriangle } from "lucide-react";
import { DiscoveryCallTriggers } from "@/utils/crispTriggers";

export default function DiscoveryCallButtons() {
  return (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Discovery Call Triggers - Examples</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Standard Discovery Call */}
        <Button 
          onClick={() => DiscoveryCallTriggers.triggerDiscoveryCall()}
          className="w-full"
          variant="outline"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Discovery Call
        </Button>

        {/* Direct Phone Call */}
        <Button 
          onClick={() => DiscoveryCallTriggers.triggerPhoneCall()}
          className="w-full"
          variant="outline"
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Me Now
        </Button>

        {/* WhatsApp */}
        <Button 
          onClick={() => DiscoveryCallTriggers.triggerWhatsApp()}
          className="w-full"
          variant="outline"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp Chat
        </Button>

        {/* Video Call */}
        <Button 
          onClick={() => DiscoveryCallTriggers.triggerVideoCall()}
          className="w-full"
          variant="outline"
        >
          <Video className="w-4 h-4 mr-2" />
          Video Call
        </Button>

        {/* Urgent Call */}
        <Button 
          onClick={() => DiscoveryCallTriggers.triggerUrgentCall()}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Urgent Security Issue
        </Button>

        {/* Custom Message */}
        <Button 
          onClick={() => DiscoveryCallTriggers.triggerDiscoveryCall(
            "Hi! I see you're interested in our AI-driven penetration testing services.\n\n" +
            "I'd love to discuss how we can help secure your organization.\n\n" +
            "Would you prefer:\n" +
            "1. 📞 A quick phone call\n" +
            "2. 💬 WhatsApp conversation\n" +
            "3. 📧 Email consultation\n\n" +
            "What works best for you?"
          )}
          className="w-full"
          variant="outline"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Custom Message
        </Button>
      </div>
    </div>
  );
}
