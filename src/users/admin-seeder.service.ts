import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserRole } from './entities/user.entity'

@Injectable()
export class AdminSeederService implements OnModuleInit {
    private readonly logger = new Logger(AdminSeederService.name)

    constructor(private readonly usersService: UsersService) {}

    async onModuleInit() {
        await this.createDefaultAdmin()
    }

    private async createDefaultAdmin() {
        try {
            // Check if any admin user exists
            const adminUsers = await this.usersService.findAll()
            const hasAdmin = adminUsers.some((user) => user.role === UserRole.ADMIN)

            if (hasAdmin) {
                this.logger.log('Admin user already exists')
                return
            }

            // Create default admin user
            const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin-test@k-group.com'
            const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

            // Check if user with this email already exists (even if not admin)
            const existingUser = await this.usersService.findByEmail(defaultAdminEmail)

            if (existingUser) {
                // If user exists but is not admin, promote to admin
                if (existingUser.role !== UserRole.ADMIN) {
                    await this.usersService.update(existingUser.id, { role: UserRole.ADMIN })
                    this.logger.log(`Existing user ${defaultAdminEmail} promoted to admin`)
                } else {
                    this.logger.log(`Admin user ${defaultAdminEmail} already exists`)
                }
                return
            }

            // Create new admin user
            const adminUser = await this.usersService.create({
                email: defaultAdminEmail,
                firstName: 'Admin',
                lastName: 'User',
                password: defaultAdminPassword,
                role: UserRole.ADMIN,
            })

            this.logger.log(`✅ Default admin user created successfully with email: ${adminUser.email}`)

            if (!process.env.ADMIN_PASSWORD) {
                this.logger.warn(`⚠️  Default admin password: ${defaultAdminPassword}`)
                this.logger.warn('⚠️  Please change the default admin password after first login!')
                this.logger.warn('⚠️  Set ADMIN_PASSWORD environment variable to customize the password')
            }
        } catch (error) {
            if (error.message?.includes('Email already exists')) {
                this.logger.log('Admin user with this email already exists')
            } else {
                this.logger.error('❌ Error creating default admin user:', error.message)
            }
        }
    }
}
