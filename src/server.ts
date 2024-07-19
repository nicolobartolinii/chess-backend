import app from './app';

/** Port where the app will listen */
const PORT = process.env.APPLICATION_PORT || 3000;

/** Starts the server */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});