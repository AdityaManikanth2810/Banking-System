import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
} from 'typeorm';
import { Customer } from './customer';
import { Transaction } from './transaction';
import { PublicKey } from '../utils/security';

interface StorePublicKey {
	n: string;
	g: string;
}

export enum accountTypes {
	SAVINGS = 'savings',
	CURRENT = 'current',
	FD = 'fixed deposit',
	RECURRING = 'recurring',
}

@Entity()
export class Account {
	@PrimaryGeneratedColumn('uuid')
	accountNumber!: string;

	@Column('string', { nullable: false })
	hashedPin!: string;

	@Column({
		type: 'enum',
		enum: accountTypes,
		default: accountTypes.SAVINGS,
	})
	role!: accountTypes;

	@Column('text')
	balance!: string;

	@Column('json', { nullable: true })
	publicKey?: StorePublicKey;

	@ManyToOne(() => Customer, customer => customer.accounts)
	customer!: Customer;

	@CreateDateColumn()
	accountCreated!: string;

	@OneToMany(() => Transaction, account => account.transactionId)
	transactions!: Transaction[];

	constructor(
		customer: Customer,
		publicKey: PublicKey,
		balance: bigint,
		pin: string
	) {
		this.customer = customer;
		this.publicKey = {
			n: publicKey.n.toString(),
			g: publicKey.g.toString(),
		};
		this.balance = balance.toString();
		this.hashedPin = pin;
	}
}
