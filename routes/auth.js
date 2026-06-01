const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ── SIGNUP ────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existing) {
        return res.status(400).json({ error: 'Email sudah terdaftar!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
        .from('users')
        .insert([{ fullname, email, password: hashedPassword }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: 'Akun berhasil dibuat!' });
});

// ── LOGIN ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    // Tambahkan ini untuk debug
    console.log('User found:', user);
    console.log('Error:', error);

    if (error || !user) {
        return res.status(401).json({ error: 'Akun belum terdaftar atau password salah!' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: 'Akun belum terdaftar atau password salah!' });
    }

    res.status(200).json({
        message: 'Login berhasil!',
        user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email
        }
    });
});

module.exports = router;
