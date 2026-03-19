import React, { useCallback, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import RateLimitedUI from '../components/RateLimitedUI.jsx'
import AddItemModal from '../components/AddItemModal.jsx'
import ItemNotesModal from '../components/ItemNotesModal.jsx'
import ItemImagesModal from '../components/ItemImagesModal.jsx'
import apiClient from '../services/apiClient.js'
import toast from 'react-hot-toast'
import ItemCard from '../components/ItemCard.jsx'
import ItemListItem from '../components/ItemListItem.jsx'
import { ArrowUp, ArrowDown, Grid, List } from 'lucide-react'

const ItemsListPage = () => {
    const { onVehicleAdded } = useOutletContext()
    const [ loading, setLoading ] = React.useState(true)
    const [ rateLimited, setRateLimited ] = React.useState(false)
    const [ items, setItems ] = React.useState([])
    const [ searchTerm, setSearchTerm ] = React.useState('')
    const [ orderBy, setOrderBy ] = React.useState('dateAdded')
    const [ sortDirection, setSortDirection ] = React.useState('desc')
    const [ isScrolled, setIsScrolled ] = React.useState(false)
    const [ showAddItemModal, setShowAddItemModal ] = React.useState(false)
    const [ itemsToShow, setItemsToShow ] = React.useState(20)
    const [ layoutView, setLayoutView ] = React.useState('grid')
    const [ showNotesModal, setShowNotesModal ] = React.useState(false)
    const [ selectedNotesItem, setSelectedNotesItem ] = React.useState(null)
    const [ showImagesModal, setShowImagesModal ] = React.useState(false)
    const [ selectedImagesItem, setSelectedImagesItem ] = React.useState(null)

    React.useEffect(() => {
        let throttleTimer = null
        
        const handleScroll = () => {
            if (throttleTimer) return
            
            throttleTimer = setTimeout(() => {
                setIsScrolled(window.scrollY > 100)
                
                // Lazy load more items when user scrolls near bottom
                const scrolledPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
                if (scrolledPercentage > 0.8) {
                    setItemsToShow(prev => prev + 20)
                }
                
                throttleTimer = null
            }, 100)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (throttleTimer) clearTimeout(throttleTimer)
        }
    }, [])

    const fetchItems = useCallback(async () => {
        toast.loading('Loading items...', { id: 'fetchItems' })
        try {
            const res = await apiClient.get('/api/item/listall')
            setItems(res?.data?.items || [])
            setRateLimited(false)
            toast.dismiss('fetchItems')
            toast.success('Items loaded successfully!', { id: 'fetchItems' })
        } catch (error) {
            console.log("Error fetching items:", error)
            if (error.response && error.response.status === 429) {
                setRateLimited(true)
            }
            toast.dismiss('fetchItems')
            toast.error('Error fetching items', { id: 'fetchItems' })
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchItems()
    }, [fetchItems])

    React.useEffect(() => {
        const handleOpenModal = () => setShowAddItemModal(true)
        window.addEventListener('openAddItemModal', handleOpenModal)
        return () => window.removeEventListener('openAddItemModal', handleOpenModal)
    }, [])

    const handleItemAddedSuccess = () => {
        fetchItems()
        setShowAddItemModal(false)
    }

    // Reset items to show when filters change
    React.useEffect(() => {
        setItemsToShow(20)
    }, [searchTerm, orderBy, sortDirection])

    // Filter items based on search term
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = !searchTerm || 
                                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            return matchesSearch
        }).sort((a, b) => {
            let aValue, bValue
            const isAsc = sortDirection === 'asc'
            
            switch(orderBy) {
                case 'dateAdded':
                    aValue = new Date(a.createdAt).getTime()
                    bValue = new Date(b.createdAt).getTime()
                    return isAsc ? aValue - bValue : bValue - aValue
                case 'name':
                    aValue = a.name || ''
                    bValue = b.name || ''
                    return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
                case 'value':
                    aValue = a.estimatedValue || 0
                    bValue = b.estimatedValue || 0
                    return isAsc ? aValue - bValue : bValue - aValue
                default:
                    return 0
            }
        })
    }, [items, searchTerm, orderBy, sortDirection])

    // Callbacks for Notes Modal
    const handleShowNotes = useCallback((item) => {
        setSelectedNotesItem(item)
        setShowNotesModal(true)
    }, [])

    const handleCloseNotes = useCallback(() => {
        setShowNotesModal(false)
        setSelectedNotesItem(null)
    }, [])

    // Callbacks for Images Modal
    const handleShowImages = useCallback((item) => {
        setSelectedImagesItem(item)
        setShowImagesModal(true)
    }, [])

    const handleCloseImages = useCallback(() => {
        setShowImagesModal(false)
        setSelectedImagesItem(null)
    }, [])

    const handleItemUpdate = useCallback((updatedItem) => {
        setItems(items.map(item => item._id === updatedItem._id ? updatedItem : item))
    }, [items])

    return (
        <div className='min-h-screen'>
            {/* Filter Bar */}
            <div className={`md:sticky md:top-16 md:z-20 py-2 transition-all ${isScrolled ? 'md:bg-black md:border-b md:border-gray-200 md:shadow-sm' : ''}`}>
                <div className="max-w-[84rem] mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className={`block text-sm font-medium text-gray-400 mb-1 transition-all ${isScrolled ? 'hidden md:block' : ''}`}>
                                Search
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search items..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Sort By */}
                        <div>
                            <label htmlFor="sortBy" className={`block text-sm font-medium text-gray-400 mb-1 transition-all ${isScrolled ? 'hidden md:block' : ''}`}>
                                Sort By
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="sortBy"
                                    value={orderBy}
                                    onChange={(e) => setOrderBy(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="dateAdded">Date Added</option>
                                    <option value="name">Name</option>
                                    <option value="value">Est. Value</option>
                                </select>
                                <button
                                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                                >
                                    {sortDirection === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Layout Toggle */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => setLayoutView('grid')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                                layoutView === 'grid'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                            }`}
                            title="Grid View"
                        >
                            <Grid size={20} />
                            Grid
                        </button>
                        <button
                            onClick={() => setLayoutView('list')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                                layoutView === 'list'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                            }`}
                            title="List View"
                        >
                            <List size={20} />
                            List
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Semi-transparent overlay when loading */}
            {loading && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none"></div>
                    <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
                    </div>
                </>
            )}

            <div className="max-w-[84rem] mx-auto px-4 py-0 mt-0">
                {(filteredItems.length > 0) && (!rateLimited) && (
                    <>
                        {layoutView === 'grid' ? (
                            // Grid View
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {filteredItems.slice(0, itemsToShow).map(item => (
                                    <ItemCard key={item._id} item={item} setLoading={setLoading} items={items} setItems={setItems} />
                                ))}
                            </div>
                        ) : (
                            // List View - Table Layout
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name & Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Weight</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Est. Value</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date Added</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.slice(0, itemsToShow).map(item => (
                                            <ItemListItem 
                                                key={item._id} 
                                                item={item} 
                                                setLoading={setLoading} 
                                                items={items} 
                                                setItems={setItems}
                                                onShowNotes={handleShowNotes}
                                                onShowImages={handleShowImages}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {itemsToShow < filteredItems.length && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">
                                    Showing {itemsToShow} of {filteredItems.length} items. Scroll down to load more.
                                </p>
                            </div>
                        )}
                    </>
                )}
                {(filteredItems.length === 0) && (items.length > 0) && (!rateLimited) && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No items match your search</p>
                    </div>
                )}
                {(items.length === 0) && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No items yet. Click "Add" to create one!</p>
                    </div>
                )}
            </div>

            {rateLimited && <RateLimitedUI />}

            {/* Add Item Modal */}
            <AddItemModal 
                isOpen={showAddItemModal} 
                onClose={() => setShowAddItemModal(false)}
                onItemAdded={handleItemAddedSuccess}
            />

            {/* Notes Modal */}
            {selectedNotesItem && (
                <ItemNotesModal 
                    key={selectedNotesItem._id}
                    isOpen={showNotesModal} 
                    onClose={handleCloseNotes}
                    item={selectedNotesItem}
                    onItemUpdate={handleItemUpdate}
                />
            )}

            {/* Images Modal */}
            {selectedImagesItem && (
                <ItemImagesModal 
                    key={selectedImagesItem._id}
                    isOpen={showImagesModal} 
                    onClose={handleCloseImages}
                    item={selectedImagesItem}
                />
            )}
        </div>
    )
}

export default ItemsListPage
