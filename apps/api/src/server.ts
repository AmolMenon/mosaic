import { app } from "./api/main";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
