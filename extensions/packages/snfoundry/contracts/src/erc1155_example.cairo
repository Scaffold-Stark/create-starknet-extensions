// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts for Cairo ^2.0.0

use starknet::ContractAddress;

#[starknet::interface]
pub trait IErc1155Example<T> {
    fn mint_item(
        ref self: T, account: ContractAddress, token_id: u256, value: u256, data: Span<felt252>,
    );
    fn batch_mint_items(
        ref self: T,
        account: ContractAddress,
        token_ids: Span<u256>,
        values: Span<u256>,
        data: Span<felt252>,
    );
    fn get_gold_id(self: @T) -> u256;
    fn get_silver_id(self: @T) -> u256;
    fn get_thors_hammer_id(self: @T) -> u256;
    fn get_sword_id(self: @T) -> u256;
    fn get_shield_id(self: @T) -> u256;
}

#[starknet::contract]
pub mod Erc1155Example {
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc1155::{ERC1155Component, ERC1155HooksEmptyImpl};
    use starknet::ContractAddress;
    use super::IErc1155Example;

    // Items token IDs
    const GOLD: u256 = 0;
    const SILVER: u256 = 1;
    const THORS_HAMMER: u256 = 2;
    const SWORD: u256 = 3;
    const SHIELD: u256 = 4;

    component!(path: ERC1155Component, storage: erc1155, event: ERC1155Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // Expose entrypoints
    #[abi(embed_v0)]
    impl ERC1155Impl = ERC1155Component::ERC1155Impl<ContractState>;
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;

    // Use internal implementations but do not expose them
    impl ERC1155InternalImpl = ERC1155Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        erc1155: ERC1155Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC1155Event: ERC1155Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        // Initialize ERC1155 with base URI
        self.erc1155.initializer("https://game.example/api/item/{id}.json");
        self.ownable.initializer(owner);

        // Mint initial game items to the owner
        self._mint_initial_items(owner);
    }

    #[abi(embed_v0)]
    pub impl Erc1155ExampleImpl of IErc1155Example<ContractState> {
        fn mint_item(
            ref self: ContractState,
            account: ContractAddress,
            token_id: u256,
            value: u256,
            data: Span<felt252>,
        ) {
            self.ownable.assert_only_owner();
            self.erc1155.mint_with_acceptance_check(account, token_id, value, data);
        }

        fn batch_mint_items(
            ref self: ContractState,
            account: ContractAddress,
            token_ids: Span<u256>,
            values: Span<u256>,
            data: Span<felt252>,
        ) {
            self.ownable.assert_only_owner();
            self.erc1155.batch_mint_with_acceptance_check(account, token_ids, values, data);
        }

        fn get_gold_id(self: @ContractState) -> u256 {
            GOLD
        }

        fn get_silver_id(self: @ContractState) -> u256 {
            SILVER
        }

        fn get_thors_hammer_id(self: @ContractState) -> u256 {
            THORS_HAMMER
        }

        fn get_sword_id(self: @ContractState) -> u256 {
            SWORD
        }

        fn get_shield_id(self: @ContractState) -> u256 {
            SHIELD
        }
    }

    // Internal function to mint initial game items
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _mint_initial_items(ref self: ContractState, owner: ContractAddress) {
            let empty_data: Span<felt252> = array![].span();

            // Mint Gold: 10^18 tokens
            let gold_amount = self.u256_pow(10, 18);
            self.erc1155.mint_with_acceptance_check(owner, GOLD, gold_amount, empty_data);

            // Mint Silver: 10^27 tokens
            let silver_amount = self.u256_pow(10, 27);
            self.erc1155.mint_with_acceptance_check(owner, SILVER, silver_amount, empty_data);

            // Mint Thor's Hammer: 1 token
            self.erc1155.mint_with_acceptance_check(owner, THORS_HAMMER, 1, empty_data);

            // Mint Sword: 10^9 tokens
            let sword_amount = self.u256_pow(10, 9);
            self.erc1155.mint_with_acceptance_check(owner, SWORD, sword_amount, empty_data);

            // Mint Shield: 10^9 tokens
            let shield_amount = self.u256_pow(10, 9);
            self.erc1155.mint_with_acceptance_check(owner, SHIELD, shield_amount, empty_data);
        }

        // Helper function to calculate u256 powers
        fn u256_pow(self: @ContractState, base: u256, exp: u256) -> u256 {
            if exp == 0 {
                return 1;
            }
            let mut result = base;
            let mut i = 1;
            while i < exp {
                result = result * base;
                i += 1;
            }
            result
        }
    }
}
