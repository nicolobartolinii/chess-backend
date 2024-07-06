import app from './app';
import {seed} from './models/seed'

seed(true, true, true).then(() => console.log('Database seeded'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});