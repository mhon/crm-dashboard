import { Router } from "express";
import { generateLeadScore, draftEmail, summarizeMeeting } from "@workspace/ai";
import { requireAuth } from "../middlewares/rbac";

const router = Router();

// Secure all AI routes
router.use(requireAuth);

router.post("/lead-score", async (req, res) => {
  try {
    const { leadData } = req.body;
    if (!leadData) {
      return res.status(400).json({ error: "Missing leadData in request body" });
    }

    const result = await generateLeadScore(leadData);
    return res.json(result);
  } catch (error: any) {
    req.log.error({ error }, "Error generating lead score");
    return res.status(500).json({ error: "Failed to generate lead score" });
  }
});

router.post("/email-draft", async (req, res) => {
  try {
    const { recipientName, purpose, additionalInfo } = req.body;
    if (!recipientName || !purpose) {
      return res.status(400).json({ error: "Missing required fields: recipientName, purpose" });
    }

    const draft = await draftEmail({ recipientName, purpose, additionalInfo });
    return res.json({ draft });
  } catch (error: any) {
    req.log.error({ error }, "Error drafting email");
    return res.status(500).json({ error: "Failed to draft email" });
  }
});

router.post("/meeting-summary", async (req, res) => {
  try {
    const { meetingNotes } = req.body;
    if (!meetingNotes) {
      return res.status(400).json({ error: "Missing meetingNotes in request body" });
    }

    const summary = await summarizeMeeting(meetingNotes);
    return res.json({ summary });
  } catch (error: any) {
    req.log.error({ error }, "Error summarizing meeting");
    return res.status(500).json({ error: "Failed to summarize meeting" });
  }
});

export default router;
