# GroupWise - Component Structure

## 📁 Project Structure

```
app/
├── page.tsx                 # Main page component (simplified)
├── layout.tsx              # App layout with metadata
└── globals.css             # Global styles

components/
├── GroupList.tsx           # Display list of groups
├── CreateGroupForm.tsx     # Form for creating new groups
├── GroupDetail.tsx         # Group detail view with member management
└── SubgroupGenerator.tsx   # Generate and display subgroups

lib/
├── types.ts               # TypeScript interfaces
├── utils.ts              # Utility functions (subgroup generation)
└── useLocalStorageGroups.ts # Custom hook for localStorage operations
```

## 🧩 Components

### **GroupList**
- Displays all user groups
- Shows member count and creation date
- Handles group selection

### **CreateGroupForm**
- Toggle between button and form state
- Handles group creation with validation
- Auto-focuses on input when opened

### **GroupDetail**
- Complete group management interface
- Member addition/removal
- Group renaming functionality
- Integrates SubgroupGenerator

### **SubgroupGenerator**
- Mode selection: multi-round rotation or single split
- Group size selection (defaults to pairs)
- Round count selection for rotation mode
- Subgroup generation and results display with numbering

## 🪝 Custom Hooks

### **useLocalStorageGroups**
- Manages group state persistence
- Provides CRUD operations (add, update, delete)
- Handles JSON serialization/deserialization

## 🛠️ Utilities

### **generateRoundRobinSubgroups**
- Circle-method round-robin for pairs (subgroup size 2)
- Every member pairs with every other member exactly once across rounds
- Adds a "bye" for an odd number of participants

### **splitIntoGroups**
- Splits members into a single set of groups of a chosen size
- Distributes leftovers so groups stay as even as possible (some get one extra)

### **generateRotationRounds**
- Multi-round rotation for any group size
- Pairs reuse the perfect round-robin; larger groups use a greedy heuristic that
  minimizes repeat co-memberships across the requested number of rounds

## 🎯 Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or modified
3. **Testing**: Smaller components are easier to unit test
4. **Type Safety**: Centralized type definitions
5. **Performance**: Components only re-render when their specific data changes

## 🚀 Usage

The main page (`app/page.tsx`) now acts as a simple coordinator, managing the view state and passing data between components. All business logic is encapsulated within the appropriate components and hooks.
