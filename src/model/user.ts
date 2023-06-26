import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

type UserAttributes ={
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: number;
}

type UserCreationAttributes= Optional<UserAttributes, 'userId'> ;

class User extends Model<UserAttributes, UserCreationAttributes> {
	public userId!: string;
	public role!: string;
	public firstName!: string;
	public lastName!: string;
	public email!: string;
	public password!: string;
	public address!: string;
	public phoneNumber!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}

export default function(sequelize: Sequelize) {
	User.init(
		{
			userId: {
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
				unique: true
			},
			role: {
				type: DataTypes.STRING
			},
			firstName: {
				type: DataTypes.STRING
			},
			lastName: {
				type: DataTypes.STRING
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true }
			},
			password: {
				type: DataTypes.STRING
			},
			address: {
				type: DataTypes.STRING
			},
			phoneNumber: {
				type: DataTypes.INTEGER
			}
		},
		{
			sequelize,
			modelName: 'user',
			deletedAt: 'deletedAt',
			timestamps: true,
			paranoid: true
		}
	);

	return User;
}
