import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define Schemas
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'patient', enum: ['patient', 'doctor', 'pharmacist', 'admin'] },
    phone: { type: String },
    bio: { type: String },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        medicineReminders: { type: Boolean, default: true },
        interactionAlerts: { type: Boolean, default: true },
        news: { type: Boolean, default: false }
    },
    allergies: [String],
    created_at: { type: Date, default: Date.now }
});

const PrescriptionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    medicines: [String],
    dosages: [String],
    confidence: Number,
    safetyScore: Number,
    warnings: [String],
    imageUrl: String,
    doctorName: { type: String, default: 'Unknown Doctor' },
    status: { type: String, default: 'analyzed' },
    doctorNotes: String,
    dispensedBy: String,
    dispensedAt: Date,
    created_at: { type: Date, default: Date.now }
});

const InteractionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    medicines: [String],
    analysis: mongoose.Schema.Types.Mixed, // flexible JSON structure for the AI result
    safetyScore: Number,
    created_at: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    type: { type: String, enum: ['critical', 'warning', 'info'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
const Interaction = mongoose.models.Interaction || mongoose.model('Interaction', InteractionSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

class MongoDB {
    // ... constructor...

    // ... (previous methods) ...

    // Notification Methods
    async createNotification(userId, data) {
        await this.connect();
        const notification = await Notification.create({
            user_id: userId,
            ...data
        });
        return this._format(notification);
    }

    async getNotifications(userId) {
        await this.connect();
        const notifications = await Notification.find({ user_id: userId })
            .sort({ created_at: -1 })
            .limit(20);
        return notifications.map(doc => this._format(doc));
    }

    async markNotificationRead(id) {
        await this.connect();
        const notification = await Notification.findByIdAndUpdate(
            id,
            { is_read: true },
            { new: true }
        );
        return notification ? this._format(notification) : null;
    }

    async markAllNotificationsRead(userId) {
        await this.connect();
        await Notification.updateMany(
            { user_id: userId, is_read: false },
            { is_read: true }
        );
        return true;
    }

    async deleteNotification(id) {
        await this.connect();
        await Notification.findByIdAndDelete(id);
        return true;
    }

    async createInteraction(userId, data) {
        await this.connect();
        const interaction = await Interaction.create({
            user_id: userId,
            ...data
        });
        return this._format(interaction);
    }

    async getInteractions(userId) {
        await this.connect();
        const interactions = await Interaction.find({ user_id: userId })
            .sort({ created_at: -1 })
            .limit(10); // Limit to last 10
        return interactions.map(doc => this._format(doc));
    }

    constructor() {
        console.log('🍃 MongoDB Adapter Initialized');
    }

    async connect() {
        if (mongoose.connection.readyState >= 1) return;

        try {
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI is not defined in .env');
            }
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB Connection Error:', error);
            throw error;
        }
    }

    // Helper to format Mongo docs to simple objects with 'id'
    _format(doc) {
        if (!doc) return null;
        const obj = doc.toObject();
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
        return obj;
    }

    // User Methods
    async createUser(userData) {
        // Ensure connection
        await this.connect();

        const { email, password, name, role = 'patient' } = userData;

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            name,
            role
        });

        return this._format(newUser);
    }

    async findUserByEmail(email) {
        await this.connect();
        const user = await User.findOne({ email });
        return this._format(user);
    }

    async findUserById(id) {
        await this.connect();
        try {
            const user = await User.findById(id);
            return this._format(user);
        } catch (e) {
            return null;
        }
    }

    async updateUser(id, updates) {
        await this.connect();
        // Prevent updating email to existing email if handled here? 
        // Ideally checking uniqueness if email changes.
        // For now simple update.
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        return this._format(user);
    }

    // Prescription Methods
    async createPrescription(userId, data) {
        await this.connect();
        const newPrescription = await Prescription.create({
            user_id: userId,
            ...data
        });
        return this._format(newPrescription);
    }

    async getUserPrescriptions(userId) {
        await this.connect();
        const prescriptions = await Prescription.find({ user_id: userId }).sort({ created_at: -1 });
        return prescriptions.map(p => this._format(p));
    }

    async getAllPrescriptions() {
        await this.connect();
        const prescriptions = await Prescription.find().sort({ created_at: -1 }).limit(20);
        return prescriptions.map(p => this._format(p));
    }

    async getPrescriptionById(id) {
        await this.connect();
        try {
            const prescription = await Prescription.findById(id);
            return this._format(prescription);
        } catch {
            return null;
        }
    }

    async updatePrescription(id, updates) {
        await this.connect();
        const prescription = await Prescription.findByIdAndUpdate(id, updates, { new: true });
        return this._format(prescription);
    }
}

const db = new MongoDB();
export default db;
