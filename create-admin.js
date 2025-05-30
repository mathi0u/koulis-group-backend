// Simple script to create an initial admin user
const { Client } = require('pg')
const bcrypt = require('bcrypt')

async function createAdminUser() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'user',
        password: 'password',
    })

    try {
        await client.connect()
        console.log('Connected to database')

        // Hash the password
        const hashedPassword = await bcrypt.hash('Admin123!', 10)

        // Insert admin user
        const query = `
            INSERT INTO "user" (email, "firstName", "lastName", password, role, "isActive", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, email, "firstName", "lastName", role;
        `

        const values = ['admin@k-group.com', 'Admin', 'User', hashedPassword, 'ADMIN', true, new Date(), new Date()]

        const result = await client.query(query, values)

        if (result.rows.length > 0) {
            console.log('Admin user created successfully:', result.rows[0])
        } else {
            console.log('Admin user already exists')
        }
    } catch (error) {
        console.error('Error creating admin user:', error)
    } finally {
        await client.end()
    }
}

createAdminUser()
