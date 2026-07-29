/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, List, ChefHat, Folder, Users, Truck, Gift, Star, MessageSquare, 
  BarChart3, FileText, UserCheck, Settings, Lock, Search, Filter, Plus, 
  Trash2, Edit2, Check, Save, Eye, EyeOff, AlertTriangle, CheckCircle2, 
  ChevronRight, ArrowUpRight, ArrowDownRight, RefreshCw, Printer, AlertCircle, 
  Download, Clock, Calendar, PlusCircle, Power, UserMinus, ShieldAlert,
  ChevronDown, X, MessageCircle, Send, CheckSquare, Heart, MapPin, Copy
} from 'lucide-react';
import { Meal, Order, OrderStatus } from '../types';
import { MEALS } from '../data';
import BibiLogo from './BibiLogo';

interface AdminDashboardViewProps {
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  onNavigate: (view: string) => void;
  onLogout?: () => void;
}

// ----------------------------------------------------------------------
// DATA SCHEMAS FOR ADMIN CONSOLE
// ----------------------------------------------------------------------

interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'expired' | 'paused';
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Kitchen Staff' | 'Cashier' | 'Manager' | 'Support Team' | 'Rider';
  phone: string;
  status: 'active' | 'inactive';
}

interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'replied' | 'resolved' | 'archived';
  replyText?: string;
}

interface AdminReview {
  id: string;
  customerName: string;
  rating: number;
  mealName: string;
  reviewText: string;
  type: 'meal' | 'delivery' | 'support';
  date: string;
  status: 'featured' | 'visible' | 'hidden';
  reply?: string;
}

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: string;
  hidden: boolean;
  order: number;
}

export default function AdminDashboardView({
  activeOrder,
  setActiveOrder,
  onNavigate,
  onLogout
}: AdminDashboardViewProps) {
  // Navigation: state values map to specific panels
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [successToast, setSuccessToast] = useState<string>('');
  
  // Quick notifications queue state (Low stock, order cancelled, etc)
  const [adminNotifs, setAdminNotifs] = useState<Array<{ id: string; type: string; title: string; time: string; unread: boolean }>>([
    { id: 'an-1', type: 'order', title: 'New order #BIBI-88129 from Bisola J.', time: '2 mins ago', unread: true },
    { id: 'an-2', type: 'cancelled', title: 'Order #BIBI-52119 was cancelled by customer', time: '1 hr ago', unread: true },
    { id: 'an-3', type: 'stock', title: 'Smoky Jerk Chicken Pizza (Low Stock - 8 left)', time: '3 hrs ago', unread: false },
    { id: 'an-4', type: 'review', title: 'New 5-star review left by Sarah J.', time: '5 hrs ago', unread: false },
    { id: 'an-5', type: 'enquiry', title: 'New business enquiry from Lagos Catering Ltd', time: '1 day ago', unread: false }
  ]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Trigger Toast Alert
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // ----------------------------------------------------------------------
  // MODIFIABLE STATES (LIFETIME IN-MEMORY FOR PREVIEW OR LOCAL STORAGE)
  // ----------------------------------------------------------------------
  
  // 1. ORDERS STATE
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bibi_orders_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'BIBI-88129',
        items: [
          { meal: MEALS[0], quantity: 1 },
          { meal: MEALS[1], quantity: 2 }
        ],
        status: 'pending_payment',
        totalAmount: 17500,
        subtotal: 16000,
        deliveryFee: 1000,
        serviceFee: 500,
        deliveryOption: 'home_delivery',
        address: '14 Broad Street, Marina, Lagos',
        timestamp: '2026-07-04 14:15',
        paymentMethod: 'Debit Card (Visa)',
        cookingInstructions: 'Please separate soup and swallow bags.'
      },
      {
        id: 'BIBI-74921',
        items: [
          { meal: MEALS[0], quantity: 2 },
          { meal: MEALS[4], quantity: 1 }
        ],
        status: 'delivered',
        totalAmount: 12200,
        subtotal: 12200,
        deliveryFee: 1000,
        serviceFee: 500,
        discount: 1500,
        deliveryOption: 'home_delivery',
        address: '14 Broad Street, Marina, Lagos',
        timestamp: '2026-06-28 13:45',
        paymentMethod: 'Debit Card (Visa)',
        cookingInstructions: 'Please make the Jollof spicy.',
        verificationPin: '8821'
      },
      {
        id: 'BIBI-63910',
        items: [
          { meal: MEALS[1], quantity: 1 }
        ],
        status: 'delivered',
        totalAmount: 8000,
        subtotal: 6500,
        deliveryFee: 1000,
        serviceFee: 500,
        deliveryOption: 'home_delivery',
        address: '82 Lekki Phase 1, Lagos',
        timestamp: '2026-06-14 19:20',
        paymentMethod: 'Bank Transfer',
        verificationPin: '4192'
      },
      {
        id: 'BIBI-52119',
        items: [
          { meal: MEALS[3], quantity: 3 }
        ],
        status: 'canceled',
        totalAmount: 17100,
        subtotal: 15600,
        deliveryFee: 1000,
        serviceFee: 500,
        deliveryOption: 'home_delivery',
        address: '14 Broad Street, Marina, Lagos',
        timestamp: '2026-05-30 11:15',
        paymentMethod: 'USSD Code'
      }
    ];
  });

  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedRider, setSelectedRider] = useState<string>('Rider Babatunde O.');
  
  // 2. MENU STATE
  const [menuMeals, setMenuMeals] = useState<Meal[]>(MEALS);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    price: 0,
    prepTime: '20 mins',
    category: 'rice-meals',
    inStock: true,
    stockCount: 20,
    isPopular: false,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
  });

  // 3. CATEGORIES STATE
  const [adminCats, setAdminCats] = useState<AdminCategory[]>([
    { id: 'acat-1', name: 'Rice Meals', slug: 'rice-meals', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=300', count: '14+ Options', hidden: false, order: 1 },
    { id: 'acat-2', name: 'Soups', slug: 'soups', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783260086/1Nigerian-Pepper-Soup_gamwnr.png', count: '8+ Options', hidden: false, order: 2 },
    { id: 'acat-3', name: 'Swallow', slug: 'swallow', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783261860/swallow_vikipd.jpg', count: '10+ Options', hidden: false, order: 3 },
    { id: 'acat-4', name: 'Fast Food', slug: 'fast-food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300', count: '18+ Options', hidden: false, order: 4 },
    { id: 'acat-5', name: 'Pizza', slug: 'pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', count: '6+ Options', hidden: false, order: 5 },
    { id: 'acat-6', name: 'Chicken', slug: 'chicken', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783335102/chicken_vgmpam.jpg', count: '12+ Options', hidden: false, order: 6 },
    { id: 'acat-7', name: 'Shawarma', slug: 'shawarma', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783334951/shawama_rtcqns.jpg', count: '8+ Options', hidden: false, order: 7 },
    { id: 'acat-8', name: 'Small Chops', slug: 'small-chops', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783334466/small_chops_unlmdx.webp', count: '15+ Options', hidden: false, order: 8 },
    { id: 'acat-9', name: 'Breakfast', slug: 'breakfast', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783335244/breakfast_xfuc48.webp', count: '10+ Options', hidden: false, order: 9 },
    { id: 'acat-10', name: 'Lunch', slug: 'lunch', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300', count: '24+ Options', hidden: false, order: 10 },
    { id: 'acat-11', name: 'Dinner', slug: 'dinner', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', count: '20+ Options', hidden: false, order: 11 },
    { id: 'acat-12', name: 'Drinks', slug: 'drinks', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783335336/drinks_o1blg1.webp', count: '16+ Options', hidden: false, order: 12 },
    { id: 'acat-13', name: 'Smoothies', slug: 'smoothies', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=300', count: '7+ Options', hidden: false, order: 13 },
    { id: 'acat-14', name: 'Desserts', slug: 'desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300', count: '9+ Options', hidden: false, order: 14 },
    { id: 'acat-15', name: 'Healthy Meals', slug: 'healthy-meals', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300', count: '11+ Options', hidden: false, order: 15 }
  ]);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 4. CUSTOMERS STATE
  const [customers, setCustomers] = useState([
    { id: 'cust-1', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '+234 803 911 2234', spend: 45000, ordersCount: 9, status: 'active', favoriteMeal: MEALS[0].name, address: '14 Broad Street, Marina, Lagos' },
    { id: 'cust-2', name: 'Tobi Adebayo', email: 'tobi_adebayo@yahoo.com', phone: '+234 812 455 1290', spend: 82000, ordersCount: 15, status: 'active', favoriteMeal: MEALS[3].name, address: '82 Lekki Phase 1, Lagos' },
    { id: 'cust-3', name: 'Nkem Obi', email: 'nkem.obi@outlook.com', phone: '+234 905 112 3901', spend: 120000, ordersCount: 22, status: 'active', favoriteMeal: MEALS[2].name, address: '44 Banana Island, Ikoyi' },
    { id: 'cust-4', name: 'Damilola Yusuf', email: 'dammy_y@gmail.com', phone: '+234 802 554 9091', spend: 3200, ordersCount: 1, status: 'suspended', favoriteMeal: MEALS[4].name, address: 'VGC Phase 2, Lekki' }
  ]);
  const [customerSearch, setCustomerSearch] = useState('');

  // 5. DELIVERY STATE
  const [riders, setRiders] = useState([
    { id: 'rider-1', name: 'Rider Babatunde O.', status: 'available', rating: 4.9, activeOrder: 'None', phone: '+234 812 121 4455' },
    { id: 'rider-2', name: 'Rider Chinedu A.', status: 'busy', rating: 4.8, activeOrder: 'BIBI-88129', phone: '+234 803 778 1122' },
    { id: 'rider-3', name: 'Rider Haruna Y.', status: 'offline', rating: 4.7, activeOrder: 'None', phone: '+234 902 443 8812' }
  ]);

  // 6. PROMOTIONS STATE
  const [promos, setPromos] = useState<PromoCode[]>([
    { id: 'promo-1', code: 'WELCOME500', type: 'fixed', value: 500, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 1000, usageCount: 452, status: 'active' },
    { id: 'promo-2', code: 'JOLLOFFEST', type: 'percentage', value: 15, startDate: '2026-07-01', endDate: '2026-07-15', usageLimit: 500, usageCount: 112, status: 'active' },
    { id: 'promo-3', code: 'FREEDELIV', type: 'free_delivery', value: 0, startDate: '2026-05-01', endDate: '2026-08-31', usageLimit: 200, usageCount: 198, status: 'expired' }
  ]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    type: 'percentage' as any,
    value: 10,
    startDate: '',
    endDate: '',
    usageLimit: 100
  });

  // 7. REVIEWS STATE
  const [adminReviews, setAdminReviews] = useState<AdminReview[]>([
    { id: 'arev-1', customerName: 'Sarah Jenkins', rating: 5, mealName: MEALS[0].name, reviewText: 'The wood-fire smoky flavor is extremely rich! Packaged professionally.', type: 'meal', date: '2026-07-02', status: 'featured' },
    { id: 'arev-2', customerName: 'Tobi Adebayo', rating: 4, mealName: MEALS[3].name, reviewText: 'Burger double-patty tasted juicy, delivery rider was very polite.', type: 'delivery', date: '2026-06-29', status: 'visible' },
    { id: 'arev-3', customerName: 'Damilola Yusuf', rating: 3, mealName: MEALS[4].name, reviewText: 'Shawarma was sweet but bread wrapping felt thin.', type: 'support', date: '2026-06-15', status: 'visible' }
  ]);
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [reviewReplyText, setReviewReplyText] = useState('');

  // 8. ENQUIRIES STATE
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([
    { id: 'enq-1', name: 'Funmi Adebiyi', email: 'funmi.adebiyi@yahoo.com', phone: '+234 802 334 1122', subject: 'Corporate event catering pricing', message: 'Hello Bibi Food, we would like to book a premium Swallow and Jollof buffet bar for 80 guests in Victoria Island this coming October. Kindly send a custom quote.', date: '2026-07-03', status: 'new' },
    { id: 'enq-2', name: 'Bankole Martins', email: 'b_martins@lagoscaterers.org', phone: '+234 812 778 9901', subject: 'Rider partnership opportunities', message: 'I own 10 premium refrigerated delivery bikes in Ikoyi. How can my fleet join Bibi Food executive dispatch team?', date: '2026-06-28', status: 'resolved', replyText: 'Hello Bankole, our delivery logistics manager will contact you at your mobile number +234 812 778 9901.' }
  ]);
  const [replyEnquiryId, setReplyEnquiryId] = useState<string | null>(null);
  const [enquiryReplyText, setEnquiryReplyText] = useState('');

  // 9. STAFF STATE
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: 'st-1', name: 'Chef Babajide O.', email: 'babajide@bibifood.com', role: 'Kitchen Staff', phone: '+234 803 111 2233', status: 'active' },
    { id: 'st-2', name: 'Bisi Adeola', email: 'bisi@bibifood.com', role: 'Cashier', phone: '+234 812 990 4455', status: 'active' },
    { id: 'st-3', name: 'Efe Chukwu', email: 'efe@bibifood.com', role: 'Manager', phone: '+234 809 333 1199', status: 'active' },
    { id: 'st-4', name: 'Grace Johnson', email: 'grace@bibifood.com', role: 'Support Team', phone: '+234 905 221 0022', status: 'active' },
    { id: 'st-5', name: 'Babatunde O.', email: 'babatunde@bibifood.com', role: 'Rider', phone: '+234 812 121 4455', status: 'active' }
  ]);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Kitchen Staff' as any,
    phone: ''
  });

  // 10. SYSTEM SETTINGS STATE
  const [restaurantName, setRestaurantName] = useState('Bibi Food Cloud Kitchen');
  const [businessHoursStart, setBusinessHoursStart] = useState('08:00');
  const [businessHoursEnd, setBusinessHoursEnd] = useState('23:00');
  const [taxPercent, setTaxPercent] = useState(7.5);
  const [currency, setCurrency] = useState('₦ (NGN)');
  const [deliveryAreas, setDeliveryAreas] = useState('Marina, Lekki Phase 1, Ikoyi, Victoria Island, VGC, Ikeja');

  // Breadcrumb generation based on active tabs
  const getBreadcrumbs = () => {
    return [
      { label: 'Admin Dashboard', view: 'home' },
      { label: currentTab.charAt(0).toUpperCase() + currentTab.slice(1), view: currentTab }
    ];
  };

  // ----------------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------------
  
  // Save edited category
  const handleSaveCategory = (cat: AdminCategory) => {
    setAdminCats(adminCats.map(c => c.id === cat.id ? cat : c));
    setEditingCategory(null);
    showToast(`Category ${cat.name} modified!`);
  };

  // Delete Category
  const handleDeleteCategory = (id: string) => {
    setAdminCats(adminCats.filter(c => c.id !== id));
    showToast('Category successfully deleted.');
  };

  // Add category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: AdminCategory = {
      id: `acat-${Date.now()}`,
      name: newCategoryName,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      count: '0 Options',
      hidden: false,
      order: adminCats.length + 1
    };
    setAdminCats([...adminCats, newCat]);
    setNewCategoryName('');
    showToast('New culinary Category created!');
  };

  // Reorder Category
  const handleReorderCategory = (id: string, direction: 'up' | 'down') => {
    const idx = adminCats.findIndex(c => c.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= adminCats.length) return;

    const list = [...adminCats];
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setAdminCats(list);
  };

  // Save/Update Meal
  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeal) {
      setMenuMeals(menuMeals.map(m => m.id === editingMeal.id ? { ...m, ...mealForm } : m));
      showToast(`Meal "${mealForm.name}" updated!`);
      setEditingMeal(null);
    } else {
      const newM: Meal = {
        id: `meal-${Date.now()}`,
        name: mealForm.name,
        description: mealForm.description,
        price: Number(mealForm.price),
        prepTime: mealForm.prepTime,
        category: mealForm.category,
        inStock: mealForm.inStock,
        stockCount: Number(mealForm.stockCount),
        isPopular: mealForm.isPopular,
        isFeatured: mealForm.isFeatured,
        image: mealForm.image,
        rating: 5.0
      };
      setMenuMeals([newM, ...menuMeals]);
      showToast(`Fresh meal "${mealForm.name}" compiled to menu!`);
      setIsAddingMeal(false);
    }
  };

  // Delete Meal
  const handleDeleteMeal = (id: string) => {
    setMenuMeals(menuMeals.filter(m => m.id !== id));
    showToast('Meal successfully removed from global list.');
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const uo = { ...o, status };
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(uo);
        }
        return uo;
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('bibi_orders_history', JSON.stringify(updated));
    showToast(`Order status cycled to ${status.replace('_', ' ')}`);
  };

  // Assign Rider to order
  const handleAssignRider = (orderId: string, riderName: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const uo = { ...o, assignedRider: riderName, status: 'in_transit' as OrderStatus };
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(uo);
        }
        return uo;
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('bibi_orders_history', JSON.stringify(updated));
    setRiders(riders.map(r => r.name === riderName ? { ...r, status: 'busy', activeOrder: orderId } : r));
    showToast(`Assigned ${riderName} successfully. Status advanced.`);
  };

  // Add Promotion
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code.trim()) return;
    const p: PromoCode = {
      id: `promo-${Date.now()}`,
      code: newPromo.code.toUpperCase(),
      type: newPromo.type,
      value: Number(newPromo.value),
      startDate: newPromo.startDate || '2026-07-04',
      endDate: newPromo.endDate || '2026-08-04',
      usageLimit: Number(newPromo.usageLimit),
      usageCount: 0,
      status: 'active'
    };
    setPromos([p, ...promos]);
    setNewPromo({ code: '', type: 'percentage', value: 10, startDate: '', endDate: '', usageLimit: 100 });
    showToast(`Promotion code ${p.code} activated!`);
  };

  // Reply to Review
  const handleReplyReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyReviewId || !reviewReplyText.trim()) return;
    setAdminReviews(adminReviews.map(r => r.id === replyReviewId ? { ...r, reply: reviewReplyText } : r));
    setReplyReviewId(null);
    setReviewReplyText('');
    showToast('Your verified reply has been stored.');
  };

  // Reply to Enquiry
  const handleReplyEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyEnquiryId || !enquiryReplyText.trim()) return;
    setEnquiries(enquiries.map(en => en.id === replyEnquiryId ? { ...en, status: 'resolved', replyText: enquiryReplyText } : en));
    setReplyEnquiryId(null);
    setEnquiryReplyText('');
    showToast('Your official resolution ticket was dispatched via SMTP.');
  };

  // Add Staff Member
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;
    const ns: StaffMember = {
      id: `st-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      phone: newStaff.phone || '+234 800 BIBI STAFF',
      status: 'active'
    };
    setStaffList([...staffList, ns]);
    setNewStaff({ name: '', email: '', role: 'Kitchen Staff', phone: '' });
    setIsAddingStaff(false);
    showToast(`${ns.name} added as verified ${ns.role}!`);
  };

  // Toggle staff status
  const toggleStaffStatus = (id: string) => {
    setStaffList(staffList.map(st => st.id === id ? { ...st, status: st.status === 'active' ? 'inactive' : 'active' } : st));
    showToast('Staff status updated.');
  };

  // Empty state renderer
  const renderEmptyState = (title: string, desc: string) => (
    <div className="text-center py-12 flex flex-col items-center gap-3.5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <span className="text-3xl animate-bounce">🍽️</span>
      <div>
        <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">{title}</h4>
        <p className="font-sans text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-16 flex flex-col relative text-slate-800">
      
      {/* Toast Notifier */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-olive text-brand-cream px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-xl font-sans text-xs font-bold border border-brand-olive"
          >
            <CheckCircle2 size={16} className="text-brand-saffron" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD HERO BANNER */}
      <div className="bg-[#131E18] text-white pt-6 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-chili/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-3.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] bg-brand-saffron text-brand-charcoal font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  Admin Portal
                </span>
                <span className="text-xs text-brand-gold font-bold flex items-center gap-1">
                  <ShieldAlert size={12} />
                  <span>Bibi Food Admin</span>
                </span>
              </div>
              <h2 className="font-display font-black text-2.5xl text-white mt-1 leading-tight tracking-tight">
                Admin Dashboard
              </h2>
            </div>

            {/* Notification Center + Sync + Log Out */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-xl cursor-pointer relative"
                >
                  <AlertCircle size={16} className="text-brand-saffron" />
                  {adminNotifs.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-chili rounded-full animate-ping" />
                  )}
                </button>

                <AnimatePresence>
                  {notifDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 text-slate-800 p-3 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="font-display font-bold text-[10px] uppercase text-slate-400">Admin Notifications</span>
                        <button 
                          onClick={() => {
                            setAdminNotifs(adminNotifs.map(n => ({ ...n, unread: false })));
                            showToast('Marked all as read!');
                          }}
                          className="text-[9px] font-sans font-bold text-brand-chili hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                        {adminNotifs.map((n) => (
                          <div key={n.id} className={`p-2 rounded-lg text-[11px] font-sans ${n.unread ? 'bg-slate-50 border-l-2 border-brand-chili' : 'opacity-70'}`}>
                            <p className="font-bold text-slate-700 leading-normal">{n.title}</p>
                            <span className="block font-mono text-[9px] text-slate-400 mt-0.5">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick action: Sync */}
              <button 
                onClick={() => {
                  setOrders([...orders]);
                  showToast('Refreshed orders data!');
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-xl cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw size={16} className="text-slate-300" />
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-rose-500/20 border border-rose-400/30 text-rose-200 hover:bg-rose-500/30 px-3 py-2 rounded-xl text-xs font-sans font-bold cursor-pointer transition-colors"
                >
                  Log Out Admin
                </button>
              )}
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-sans mt-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 self-start">
            {getBreadcrumbs().map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-slate-500">/</span>}
                <button
                  onClick={() => setCurrentTab(b.view)}
                  className={`hover:text-brand-saffron transition-colors cursor-pointer ${i === getBreadcrumbs().length - 1 ? 'font-bold text-white' : ''}`}
                >
                  {b.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* CORE CONTAINER: SIDEBAR + DETAILS VIEW */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 -mt-10 relative z-20 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* RESPONSIVE ADMIN COMMAND SIDEBAR */}
        <aside className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          
          {/* Quick Active simulation indicator */}
          <div className="bg-white p-4 rounded-3xl border border-brand-olive/5 shadow-sm flex flex-col gap-2">
            <span className="block font-mono text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Live Simulation Node</span>
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-xs">
              <span className="font-sans text-[11px] text-slate-600">Active Order Run:</span>
              <span className={`font-mono font-bold ${activeOrder ? 'text-brand-basil' : 'text-slate-400'}`}>
                {activeOrder ? activeOrder.id : 'None active'}
              </span>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-4 flex flex-col gap-1 w-full overflow-x-auto lg:overflow-visible">
            <span className="px-4 pt-1 pb-2 hidden lg:block text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">ADMIN MENU</span>
            
            <div className="flex flex-row lg:flex-col gap-1 min-w-[900px] lg:min-w-0">
              {[
                { id: 'home', label: 'Dashboard Home', icon: Shield },
                { id: 'orders', label: 'Orders', icon: List, badge: orders.filter(o => o.status !== 'delivered' && o.status !== 'canceled').length || undefined },
                { id: 'menu', label: 'Food Menu', icon: ChefHat },
                { id: 'categories', label: 'Categories', icon: Folder },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'delivery', label: 'Deliveries', icon: Truck },
                { id: 'promotions', label: 'Promotions', icon: Gift },
                { id: 'reviews', label: 'Ratings & Reviews', icon: Star },
                { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: enquiries.filter(e => e.status === 'new').length || undefined },
                { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
                { id: 'reports', label: 'Reports', icon: FileText },
                { id: 'staff', label: 'Staff Management', icon: UserCheck },
                { id: 'settings', label: 'System Settings', icon: Settings },
                { id: 'security', label: 'Security', icon: Lock }
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentTab(item.id); setSelectedOrder(null); }}
                    className={`flex-1 lg:w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-olive text-brand-saffron shadow-sm shadow-brand-olive/15'
                        : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp size={14} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`font-mono text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ml-2 ${
                        isActive ? 'bg-brand-saffron text-brand-charcoal' : 'bg-brand-chili/10 text-brand-chili'
                      }`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={12} className={`hidden lg:block ${isActive ? 'text-brand-saffron' : 'text-slate-300'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* DETAILS DISPLAY COMPONENT */}
        <main className="flex-1 w-full bg-white rounded-3xl border border-brand-olive/5 shadow-md p-5 md:p-8 min-h-[580px] overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col gap-6"
            >
              {/* ========================================================== */}
              {/* TAB: DASHBOARD HOME (KPI CARDS, Best Sellers)               */}
              {/* ========================================================== */}
              {currentTab === 'home' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Grid Layout of the 10 Requested KPI Cards */}
                  <div>
                    <h3 className="font-display font-semibold text-xs uppercase text-slate-400 tracking-wider mb-3">Today's Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                      
                      {[
                        { title: "Today's Orders", val: `${orders.length}`, sub: "+12% vs yesterday", icon: "📋", trend: "up" },
                        { title: "Today's Revenue", val: `₦${orders.reduce((sum, o) => o.status !== 'canceled' ? sum + o.totalAmount : sum, 0).toLocaleString()}`, sub: "Executive platters", icon: "💰", trend: "up" },
                        { title: "In Preparation", val: `${orders.filter(o => o.status === 'preparing').length}`, sub: "Kitchen chefs busy", icon: "👨‍🍳", trend: "neutral" },
                        { title: "Awaiting Dispatch", val: `${orders.filter(o => o.status === 'pending_payment').length}`, sub: "Payment pending", icon: "📦", trend: "neutral" },
                        { title: "Completed Deliveries", val: `${orders.filter(o => o.status === 'delivered').length}`, sub: "Heat-sealed packs", icon: "🏍️", trend: "up" },
                        { title: "Cancelled Orders", val: `${orders.filter(o => o.status === 'canceled').length}`, sub: "Loss prevention target", icon: "❌", trend: "down" },
                        { title: "Active Riders", val: `${riders.filter(r => r.status === 'available' || r.status === 'busy').length}`, sub: "Thermal E-Bikes", icon: "⚡", trend: "up" },
                        { title: "CSAT Score", val: "4.95 ★", sub: "Verified reviews", icon: "⭐", trend: "up" },
                        { title: "Avg Delivery Time", val: "22 mins", sub: "Lagos grid dispatch", icon: "⏱️", trend: "up" },
                        { title: "Best Selling Meal", val: "Saffron Jollof", sub: "45 orders today", icon: "🔥", trend: "up" }
                      ].map((kpi, idx) => (
                        <div key={idx} className="bg-slate-50 hover:bg-slate-100/60 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between transition-all group cursor-pointer hover:shadow-sm">
                          <div className="flex justify-between items-start">
                            <span className="font-display font-bold text-[9px] text-slate-400 uppercase tracking-wider leading-tight max-w-[80%]">{kpi.title}</span>
                            <span className="text-sm bg-white p-1 rounded-md group-hover:scale-110 transition-transform">{kpi.icon}</span>
                          </div>
                          <div className="mt-2.5">
                            <span className="block font-mono text-sm md:text-base font-black text-brand-charcoal">{kpi.val}</span>
                            <span className={`flex items-center gap-0.5 text-[8px] font-sans font-bold mt-0.5 ${kpi.trend === 'up' ? 'text-brand-basil' : kpi.trend === 'down' ? 'text-brand-chili' : 'text-slate-400'}`}>
                              {kpi.trend === 'up' ? <ArrowUpRight size={8} /> : kpi.trend === 'down' ? <ArrowDownRight size={8} /> : null}
                              <span>{kpi.sub}</span>
                            </span>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>

                  {/* Interactive mock trend charts built using animated pure SVGs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Hourly Jollof Smoked Dispatch Runs</h4>
                          <span className="font-mono text-[9px] text-slate-400">Time-lapse vectors representing order streams in past 8 hours</span>
                        </div>
                        <span className="font-mono font-black text-[10px] bg-brand-basil/15 text-brand-basil px-2.5 py-0.5 rounded-full uppercase">Peak Hour: 14:00</span>
                      </div>

                      {/* Pure SVG Graph */}
                      <div className="w-full h-40 bg-white rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden shadow-inner border border-slate-100">
                        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                          <div className="border-b border-slate-200 w-full" />
                          <div className="border-b border-slate-200 w-full" />
                          <div className="border-b border-slate-200 w-full" />
                        </div>
                        
                        <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient-run" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C62828" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#C62828" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Grid line */}
                          <path d="M0,100 L500,100" stroke="#f1f5f9" strokeWidth="1" />
                          {/* Smooth curved path */}
                          <path
                            d="M 0,90 Q 70,50 140,80 T 280,20 T 420,60 T 500,30"
                            fill="none"
                            stroke="#C62828"
                            strokeWidth="2.5"
                          />
                          <path
                            d="M 0,90 Q 70,50 140,80 T 280,20 T 420,60 T 500,30 L 500,120 L 0,120 Z"
                            fill="url(#gradient-run)"
                          />
                        </svg>

                        <div className="flex justify-between font-mono text-[9px] text-slate-400">
                          <span>08:00</span>
                          <span>11:00</span>
                          <span>14:00</span>
                          <span>17:00</span>
                          <span>20:00</span>
                          <span>23:00</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Selling Meal metrics */}
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4">
                      <div>
                        <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Best Sellers Breakdown</h4>
                        <span className="font-mono text-[9px] text-slate-400">Verified volumetric counts this week</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {[
                          { name: "Royal Saffron Jollof Rice", val: "450 units", pct: 75, color: "bg-brand-chili" },
                          { name: "Double Smash Burger", val: "312 units", pct: 60, color: "bg-brand-gold" },
                          { name: "Poundo Gold & Okra", val: "189 units", pct: 40, color: "bg-brand-basil" }
                        ].map((best, idx) => (
                          <div key={idx} className="flex flex-col gap-1 text-xs">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-slate-700 truncate max-w-[150px]">{best.name}</span>
                              <span className="font-mono font-extrabold text-slate-400">{best.val}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className={`${best.color} h-1.5 rounded-full`} style={{ width: `${best.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: ORDER MANAGEMENT                                      */}
              {/* ========================================================== */}
              {currentTab === 'orders' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Operational Order Command Centre
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Filter, lifecycle status, assign riders, refund, print receipts, and cancel order runs.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl">
                      {['all', 'pending_payment', 'preparing', 'in_transit', 'delivered', 'canceled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1 rounded-xl text-[9px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            orderFilter === st
                              ? 'bg-white text-brand-charcoal shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search and Search Box */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80">
                      <Search size={14} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search orders by ID, address, client name..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="bg-transparent border-none text-xs focus:outline-none w-full"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const bulk = orders.map(o => o.status === 'pending_payment' ? { ...o, status: 'preparing' as OrderStatus } : o);
                        setOrders(bulk);
                        showToast('Bulk Action: Advanced all pending orders to kitchen!');
                      }}
                      className="bg-[#FAF8F5] border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer self-stretch md:self-auto"
                    >
                      Accept All Pending (Bulk Action)
                    </button>
                  </div>

                  {/* Render list of orders */}
                  {(() => {
                    let list = orders;
                    if (orderFilter !== 'all') {
                      list = list.filter(o => o.status === orderFilter);
                    }
                    if (orderSearch) {
                      list = list.filter(o => 
                        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.address.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.items.some(i => i.meal.name.toLowerCase().includes(orderSearch.toLowerCase()))
                      );
                    }

                    if (list.length === 0) {
                      return renderEmptyState('No Orders Matches', 'Try cycling through other filter state tabs or check search string keywords.');
                    }

                    return (
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* List pane */}
                        <div className="xl:col-span-2 flex flex-col gap-3">
                          {list.map((order) => {
                            const isChosen = selectedOrder?.id === order.id;
                            return (
                              <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                                  isChosen 
                                    ? 'bg-brand-olive/5 border-brand-olive shadow-sm' 
                                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-xs'
                                }`}
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-brand-charcoal">{order.id}</span>
                                    <span className="font-sans text-[10px] text-slate-400">{order.timestamp}</span>
                                  </div>
                                  <span className={`font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                    order.status === 'delivered' ? 'bg-brand-basil/10 text-brand-basil' :
                                    order.status === 'canceled' ? 'bg-brand-chili/10 text-brand-chili' :
                                    order.status === 'preparing' ? 'bg-brand-gold/15 text-brand-charcoal' :
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {order.status.replace('_', ' ')}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-600 truncate">
                                  {order.items.map(i => `${i.meal.name} x${i.quantity}`).join(', ')}
                                </div>

                                <div className="flex justify-between items-center border-t border-slate-50 pt-2.5">
                                  <span className="font-mono font-bold text-brand-olive text-sm">₦{order.totalAmount.toLocaleString()}</span>
                                  <span className="text-[10px] text-slate-400 font-sans truncate max-w-[180px]">{order.address}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Detail controls side panel */}
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4.5">
                          {selectedOrder ? (
                            <div className="flex flex-col gap-4.5 text-xs">
                              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                <div>
                                  <h4 className="font-display font-black text-brand-charcoal text-sm">{selectedOrder.id}</h4>
                                  <span className="text-[10px] text-slate-400 font-sans">{selectedOrder.timestamp}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    showToast(`PRINT RECEIPT: PDF queued for ${selectedOrder.id}`);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer text-slate-500"
                                  title="Print Receipt"
                                >
                                  <Printer size={15} />
                                </button>
                              </div>

                              <div className="flex flex-col gap-2">
                                <span className="font-mono text-[9px] text-slate-400 font-black uppercase">Culinary Items</span>
                                {selectedOrder.items.map((i, k) => (
                                  <div key={k} className="flex justify-between text-[11px] font-sans">
                                    <span className="text-slate-700 font-bold">{i.meal.name} <b className="text-brand-chili font-mono">x{i.quantity}</b></span>
                                    <span className="font-mono font-bold text-slate-500">₦{(i.meal.price * i.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-3 border-t border-slate-200 flex flex-col gap-1.5">
                                <div className="flex justify-between text-slate-500 text-[10px]">
                                  <span>Subtotal</span>
                                  <span className="font-mono">₦{selectedOrder.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 text-[10px]">
                                  <span>Delivery Fee</span>
                                  <span className="font-mono">₦{selectedOrder.deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-700 font-black text-xs pt-1 border-t border-dashed border-slate-200">
                                  <span>Total Bill</span>
                                  <span className="font-mono text-brand-basil">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1.5">
                                <span className="font-mono text-[9px] text-slate-400 font-black uppercase">Delivery Target</span>
                                <span className="font-sans font-bold leading-normal text-slate-700 text-[11px]">{selectedOrder.address}</span>
                                {selectedOrder.cookingInstructions && (
                                  <span className="block italic text-brand-chili text-[10px] mt-1 bg-brand-chili/5 px-2 py-1 rounded-md">
                                    " {selectedOrder.cookingInstructions} "
                                  </span>
                                )}
                              </div>

                              {/* Action controls */}
                              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                                <span className="font-mono text-[9px] text-slate-400 font-black uppercase">Lifecycle Actions</span>
                                
                                {selectedOrder.status === 'pending_payment' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'preparing')}
                                    className="w-full bg-brand-olive text-brand-saffron hover:bg-[#131E18] font-sans font-bold py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                                  >
                                    Accept & Begin Preparation
                                  </button>
                                )}

                                {selectedOrder.status === 'preparing' && (
                                  <div className="flex flex-col gap-2">
                                    {/* Assign Rider select wrapper */}
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[9px] text-slate-400 uppercase font-mono">Assign Fleet Rider</label>
                                      <select
                                        value={selectedRider}
                                        onChange={(e) => setSelectedRider(e.target.value)}
                                        className="bg-white border border-slate-200 p-1.5 rounded-lg text-xs"
                                      >
                                        {riders.filter(r => r.status === 'available').map(r => (
                                          <option key={r.id} value={r.name}>{r.name} ({r.rating} ★)</option>
                                        ))}
                                      </select>
                                    </div>
                                    <button
                                      onClick={() => handleAssignRider(selectedOrder.id, selectedRider)}
                                      className="w-full bg-brand-basil text-white hover:bg-brand-basil/95 font-sans font-bold py-2 rounded-xl text-xs cursor-pointer"
                                    >
                                      Mark Ready & Assign Rider
                                    </button>
                                  </div>
                                )}

                                {selectedOrder.status === 'in_transit' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                                    className="w-full bg-brand-basil text-white hover:bg-brand-basil/95 font-sans font-bold py-2 rounded-xl text-xs cursor-pointer"
                                  >
                                    Manually Complete (Delivered)
                                  </button>
                                )}

                                {selectedOrder.status !== 'canceled' && selectedOrder.status !== 'delivered' && (
                                  <div className="grid grid-cols-2 gap-2 mt-1">
                                    <button
                                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'canceled')}
                                      className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-sans font-bold py-1.5 rounded-xl text-[10px] cursor-pointer"
                                    >
                                      Cancel Order
                                    </button>
                                    <button
                                      onClick={() => {
                                        showToast(`Refund Placeholder generated for ${selectedOrder.id}. Executing banking reverse.`);
                                      }}
                                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold py-1.5 rounded-xl text-[10px] cursor-pointer"
                                    >
                                      Refund Client
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="font-sans text-xs italic text-slate-400 py-12 text-center">Select any order from the left pane to execute lifecycle advance controls.</p>
                          )}
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: MENU MANAGEMENT                                       */}
              {/* ========================================================== */}
              {currentTab === 'menu' && (
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Menu Recipe Management
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Define cooking times, pricing models, stock reserves, categories, and recommended flags.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingMeal(null);
                        setMealForm({
                          name: '', description: '', price: 3500, prepTime: '20 mins',
                          category: 'rice-meals', inStock: true, stockCount: 20,
                          isPopular: false, isFeatured: false, image: MEALS[0].image
                        });
                        setIsAddingMeal(true);
                      }}
                      className="bg-brand-olive text-brand-saffron hover:bg-[#131E18] font-display font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Meal Recipe</span>
                    </button>
                  </div>

                  {/* Add / Edit Meal Modal Panel */}
                  {(isAddingMeal || editingMeal) && (
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">
                          {editingMeal ? `Modify Recipe: ${editingMeal.name}` : 'Compile New Culinary Recipe'}
                        </h4>
                        <button 
                          onClick={() => { setIsAddingMeal(false); setEditingMeal(null); }}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveMeal} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-600">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold">Meal Recipe Title</label>
                          <input 
                            type="text" 
                            required 
                            className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive" 
                            value={mealForm.name}
                            onChange={e => setMealForm({ ...mealForm, name: e.target.value })}
                          />
                        </div>
                        <div className="flex grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Price (₦ NGN)</label>
                            <input 
                              type="number" 
                              required 
                              className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive font-mono" 
                              value={mealForm.price}
                              onChange={e => setMealForm({ ...mealForm, price: Number(e.target.value) })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Prep Time</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. 15-20 mins" 
                              className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive" 
                              value={mealForm.prepTime}
                              onChange={e => setMealForm({ ...mealForm, prepTime: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-bold">Gastronomy Description</label>
                          <textarea 
                            rows={2} 
                            required 
                            className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive resize-none" 
                            value={mealForm.description}
                            onChange={e => setMealForm({ ...mealForm, description: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 md:col-span-2">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Category Match</label>
                            <select 
                              className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive"
                              value={mealForm.category}
                              onChange={e => setMealForm({ ...mealForm, category: e.target.value })}
                            >
                              {adminCats.map(c => (
                                <option key={c.id} value={c.slug}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Unsplash Image URL (placeholder)</label>
                            <input 
                              type="text" 
                              className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive" 
                              value={mealForm.image}
                              onChange={e => setMealForm({ ...mealForm, image: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center md:col-span-2 bg-white p-3 rounded-2xl border border-slate-150">
                          <label className="flex items-center gap-2 font-bold cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={mealForm.inStock}
                              onChange={e => setMealForm({ ...mealForm, inStock: e.target.checked })}
                            />
                            <span>Instantly Available</span>
                          </label>
                          <label className="flex items-center gap-2 font-bold cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={mealForm.isPopular}
                              onChange={e => setMealForm({ ...mealForm, isPopular: e.target.checked })}
                            />
                            <span>Best Seller Tag</span>
                          </label>
                          <label className="flex items-center gap-2 font-bold cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={mealForm.isFeatured}
                              onChange={e => setMealForm({ ...mealForm, isFeatured: e.target.checked })}
                            />
                            <span>Chef Recommended</span>
                          </label>
                          <div className="flex items-center gap-1.5 ml-auto">
                            <span className="font-bold">Reserve Stock:</span>
                            <input 
                              type="number" 
                              className="bg-slate-50 border border-slate-200 p-1 w-16 text-center font-mono rounded-lg" 
                              value={mealForm.stockCount}
                              onChange={e => setMealForm({ ...mealForm, stockCount: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 md:col-span-2 pt-2">
                          <button 
                            type="button" 
                            onClick={() => { setIsAddingMeal(false); setEditingMeal(null); }}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="bg-brand-basil hover:bg-brand-basil/95 text-white font-sans font-bold px-6 py-2 rounded-xl cursor-pointer"
                          >
                            Save Recipe
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Meals grid display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuMeals.map((meal) => (
                      <div key={meal.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex gap-4 hover:shadow-xs transition-shadow">
                        <img src={meal.image} alt={meal.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-display font-bold text-xs text-brand-charcoal truncate">{meal.name}</h4>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingMeal(meal);
                                    setMealForm({
                                      name: meal.name, description: meal.description, price: meal.price,
                                      prepTime: meal.prepTime, category: meal.category, inStock: meal.inStock,
                                      stockCount: meal.stockCount || 10, isPopular: !!meal.isPopular,
                                      isFeatured: !!meal.isFeatured, image: meal.image
                                    });
                                  }}
                                  className="text-slate-400 hover:text-brand-charcoal p-1 rounded-lg cursor-pointer"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMeal(meal.id)}
                                  className="text-slate-400 hover:text-brand-chili p-1 rounded-lg cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <span className="block font-sans text-[10px] text-slate-400 mt-0.5 font-bold uppercase">{meal.category}</span>
                            <p className="font-mono text-[11px] text-brand-basil font-extrabold mt-1">₦{meal.price.toLocaleString()} • <b className="font-sans text-slate-500 font-normal">{meal.prepTime}</b></p>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2">
                            {meal.isPopular && <span className="font-mono text-[8px] bg-brand-chili/10 text-brand-chili px-2 py-0.5 rounded-full font-bold uppercase">Best Seller</span>}
                            {meal.isFeatured && <span className="font-mono text-[8px] bg-brand-gold/15 text-brand-charcoal px-2 py-0.5 rounded-full font-bold uppercase">Recommended</span>}
                            <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ml-auto ${meal.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {meal.inStock ? `In Stock (${meal.stockCount || 10})` : 'Archived'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: CATEGORIES                                            */}
              {/* ========================================================== */}
              {currentTab === 'categories' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Menu Categories & Ordering
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Create, hide, reorder, delete or edit global categories layout in client views.</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input 
                        type="text"
                        placeholder="Category Name..."
                        className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                      />
                      <button
                        onClick={handleAddCategory}
                        className="bg-brand-basil text-white hover:bg-brand-basil/95 font-display font-bold text-xs uppercase px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Create
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {adminCats.map((cat, idx) => (
                      <div key={cat.id} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div>
                            <span className="font-display font-bold text-slate-800">{cat.name}</span>
                            <span className="block font-mono text-[9px] text-slate-400 uppercase mt-0.5">{cat.slug} • {cat.count}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Ordering buttons */}
                          <div className="flex flex-col gap-1">
                            <button 
                              disabled={idx === 0}
                              onClick={() => handleReorderCategory(cat.id, 'up')}
                              className="text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer text-[10px]"
                            >
                              ▲
                            </button>
                            <button 
                              disabled={idx === adminCats.length - 1}
                              onClick={() => handleReorderCategory(cat.id, 'down')}
                              className="text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer text-[10px]"
                            >
                              ▼
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const updated = { ...cat, hidden: !cat.hidden };
                              handleSaveCategory(updated);
                            }}
                            className={`font-sans text-[10px] font-bold px-2.5 py-1 rounded-lg ${cat.hidden ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {cat.hidden ? 'Hidden' : 'Visible'}
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-slate-300 hover:text-brand-chili p-1 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: CUSTOMER MANAGEMENT                                   */}
              {/* ========================================================== */}
              {currentTab === 'customers' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Verified Club Membership Profiles
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Inspect client lifetime spent, order historical volumes, suspend accounts, and view default addresses.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-64">
                      <Search size={13} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search VIP members..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="bg-transparent border-none text-xs focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()))
                      .map((cust) => (
                        <div key={cust.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-full bg-brand-olive text-brand-saffron flex items-center justify-center font-display font-extrabold text-xs">
                                {cust.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="font-display font-bold text-xs text-brand-charcoal">{cust.name}</h4>
                                <span className="block font-sans text-[9px] text-slate-400 leading-none mt-0.5">{cust.email}</span>
                              </div>
                            </div>

                            <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${cust.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {cust.status}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                              <span className="block text-[8px] text-slate-400 font-mono uppercase">LIFETIME SPENT</span>
                              <span className="font-mono font-black text-brand-basil">₦{cust.spend.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-mono uppercase">COMPLETED RUNS</span>
                              <span className="font-mono font-black text-slate-700">{cust.ordersCount}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-mono uppercase">FAVORITE PLATES</span>
                              <span className="font-sans font-bold text-slate-600 truncate block">{cust.favoriteMeal}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-50 pt-2.5">
                            <span className="truncate max-w-[200px]">📍 {cust.address}</span>
                            
                            <button
                              onClick={() => {
                                setCustomers(customers.map(c => c.id === cust.id ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c));
                                showToast(`Client profile account status modified for ${cust.name}.`);
                              }}
                              className={`font-sans font-bold px-2.5 py-1 rounded-lg cursor-pointer ${cust.status === 'active' ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'}`}
                            >
                              {cust.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: DELIVERY MANAGEMENT                                   */}
              {/* ========================================================== */}
              {currentTab === 'delivery' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Heat-Sealed Delivery Fleet Command
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Inspect dispatch runs queue, available courier riders, check gridlock delay reports, and assign riders manually.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left pane: Available riders queue */}
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-3">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Fleet Rider States</h4>
                      {riders.map(r => (
                        <div key={r.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-sans">
                          <div>
                            <span className="font-bold text-slate-800 block">{r.name}</span>
                            <span className="block font-mono text-[9px] text-slate-400 mt-0.5">Rating: {r.rating} ★ • {r.phone}</span>
                          </div>
                          <span className={`font-mono text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                            r.status === 'available' ? 'bg-green-50 text-green-700' :
                            r.status === 'busy' ? 'bg-blue-50 text-blue-700' :
                            'bg-slate-150 text-slate-500'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Middle pane: Pending delivery runs needing attention */}
                    <div className="md:col-span-2 flex flex-col gap-3">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Active Run Logs requiring Fleet Courier</h4>
                      {(() => {
                        const targets = orders.filter(o => o.status === 'preparing' || o.status === 'pending_payment');
                        if (targets.length === 0) {
                          return renderEmptyState('No pending dispatches', 'All culinary batches are either in transit or already marked delivered.');
                        }
                        return targets.map(order => (
                          <div key={order.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-brand-charcoal">{order.id}</span>
                                <span className="font-sans text-[9px] text-slate-400">{order.timestamp}</span>
                              </div>
                              <span className="block text-slate-600 font-bold mt-1">📍 {order.address}</span>
                              <span className="block text-slate-400 text-[10px] mt-0.5">ETA: 25 mins (Est preparation & route timeline)</span>
                            </div>

                            <button
                              onClick={() => {
                                handleAssignRider(order.id, 'Rider Babatunde O.');
                              }}
                              className="bg-brand-olive text-brand-saffron hover:bg-[#131E18] font-sans font-bold px-4 py-2 rounded-xl shrink-0 cursor-pointer"
                            >
                              Dispatch Babatunde
                            </button>
                          </div>
                        ));
                      })()}
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: PROMOTIONS                                            */}
              {/* ========================================================== */}
              {currentTab === 'promotions' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Discount Campaigns & Flash Codes
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Activate percentage discounts, fixed sum deductions, free delivery, dates, and client caps.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Campaign addition */}
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider pb-2 border-b border-slate-200 mb-3">Add Promo Campaign</h4>
                      <form onSubmit={handleAddPromo} className="flex flex-col gap-3 text-xs font-sans text-slate-600">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold">Campaign Code</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. BABAJIDELAS15" 
                            className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive uppercase" 
                            value={newPromo.code}
                            onChange={e => setNewPromo({ ...newPromo, code: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Reduction Type</label>
                            <select 
                              className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive"
                              value={newPromo.type}
                              onChange={e => setNewPromo({ ...newPromo, type: e.target.value as any })}
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed Sum (₦)</option>
                              <option value="free_delivery">Free Delivery</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Value</label>
                            <input 
                              type="number" 
                              className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive font-mono" 
                              value={newPromo.value}
                              onChange={e => setNewPromo({ ...newPromo, value: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">Start Date</label>
                            <input 
                              type="date" 
                              className="bg-white border border-slate-200 p-2 rounded-xl" 
                              value={newPromo.startDate}
                              onChange={e => setNewPromo({ ...newPromo, startDate: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold">End Date</label>
                            <input 
                              type="date" 
                              className="bg-white border border-slate-200 p-2 rounded-xl" 
                              value={newPromo.endDate}
                              onChange={e => setNewPromo({ ...newPromo, endDate: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-bold">Usage Limit</label>
                          <input 
                            type="number" 
                            className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive" 
                            value={newPromo.usageLimit}
                            onChange={e => setNewPromo({ ...newPromo, usageLimit: Number(e.target.value) })}
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="bg-brand-basil hover:bg-brand-basil/95 text-white font-sans font-bold py-2 rounded-xl cursor-pointer"
                        >
                          Deploy Promo Code
                        </button>
                      </form>
                    </div>

                    {/* Active Promo Codes list */}
                    <div className="md:col-span-2 flex flex-col gap-3">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Operational Coupon Registry</h4>
                      {promos.map((p) => (
                        <div key={p.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-[#C62828] text-sm bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">{p.code}</span>
                              <span className="text-[10px] text-slate-400 font-sans">{p.startDate} to {p.endDate}</span>
                            </div>
                            <span className="block text-slate-500 font-bold mt-1">
                              {p.type === 'percentage' ? `${p.value}% Off Basket Total` : p.type === 'fixed' ? `₦${p.value} Off Total Bill` : 'Free Thermal Delivery'}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="block font-mono text-[10px] text-slate-400 uppercase">USAGE</span>
                            <span className="block font-mono font-bold text-slate-700">{p.usageCount} / {p.usageLimit}</span>
                            <button
                              onClick={() => {
                                setPromos(promos.map(pr => pr.id === p.id ? { ...pr, status: pr.status === 'active' ? 'paused' : 'active' } : pr));
                                showToast(`Campaign status updated.`);
                              }}
                              className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-lg border mt-1 cursor-pointer ${
                                p.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {p.status}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: RATINGS & REVIEWS                                     */}
              {/* ========================================================== */}
              {currentTab === 'reviews' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Verified Gastronomy Review Logs
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">View customer feedback ratings on meals, delivery speeds, and customer support representatives.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {adminReviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex flex-col gap-3 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-800">{rev.customerName}</span>
                            <span className="block text-[9px] font-mono text-slate-400 mt-0.5">Rating Category: {rev.type.toUpperCase()} • {rev.date}</span>
                          </div>

                          <span className="font-mono text-brand-gold font-bold">{`★`.repeat(rev.rating)}</span>
                        </div>

                        <p className="font-sans text-slate-600 leading-normal bg-slate-50/50 p-2 rounded-xl border border-slate-50 italic">
                          "{rev.reviewText}"
                        </p>

                        {rev.reply && (
                          <div className="bg-brand-olive/5 border border-brand-olive/10 p-3 rounded-2xl ml-4">
                            <span className="block font-mono text-[9px] text-brand-olive font-black uppercase">HQ Official Reply</span>
                            <p className="font-sans text-[11px] text-slate-700 mt-0.5 leading-normal italic">
                              "{rev.reply}"
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 items-center pt-1">
                          <button
                            onClick={() => {
                              setAdminReviews(adminReviews.map(r => r.id === rev.id ? { ...r, status: r.status === 'hidden' ? 'visible' : 'hidden' } : r));
                              showToast('Review visibility state toggled.');
                            }}
                            className={`font-sans font-bold px-2.5 py-1 rounded-lg cursor-pointer ${rev.status === 'hidden' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {rev.status === 'hidden' ? 'Visible' : 'Hide Review'}
                          </button>

                          <button
                            onClick={() => {
                              setAdminReviews(adminReviews.map(r => r.id === rev.id ? { ...r, status: r.status === 'featured' ? 'visible' : 'featured' } : r));
                              showToast('Featured status updated.');
                            }}
                            className={`font-sans font-bold px-2.5 py-1 rounded-lg cursor-pointer ${rev.status === 'featured' ? 'bg-brand-saffron text-brand-charcoal' : 'bg-slate-150 text-slate-700'}`}
                          >
                            {rev.status === 'featured' ? '★ Featured' : 'Feature Review'}
                          </button>

                          <button
                            onClick={() => {
                              setReplyReviewId(rev.id);
                              setReviewReplyText('');
                            }}
                            className="bg-brand-basil text-white font-sans font-bold px-3 py-1 rounded-lg cursor-pointer ml-1"
                          >
                            Reply
                          </button>
                        </div>

                        {replyReviewId === rev.id && (
                          <form onSubmit={handleReplyReview} className="flex gap-2 mt-2">
                            <input 
                              type="text" 
                              required 
                              placeholder="Type official reply..." 
                              className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs flex-1"
                              value={reviewReplyText}
                              onChange={e => setReviewReplyText(e.target.value)}
                            />
                            <button type="submit" className="bg-brand-olive text-brand-saffron font-bold px-4 rounded-xl">
                              Send
                            </button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: ENQUIRIES                                             */}
              {/* ========================================================== */}
              {currentTab === 'enquiries' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Client Enquiry Management Desk
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Address business queries, corporate catering quotes, partnerships, or logistics enquiries.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {enquiries.map((en) => (
                      <div key={en.id} className="p-4 bg-white border border-slate-150 rounded-3xl flex flex-col gap-3 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-display font-bold text-sm text-brand-charcoal">{en.subject}</span>
                            <span className="block font-mono text-[9px] text-slate-400 mt-0.5">From: {en.name} • {en.email} • {en.phone}</span>
                          </div>

                          <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${en.status === 'new' ? 'bg-rose-50 text-rose-700' : 'bg-green-50 text-green-700'}`}>
                            {en.status}
                          </span>
                        </div>

                        <p className="font-sans text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed italic">
                          "{en.message}"
                        </p>

                        {en.replyText && (
                          <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200/50">
                            <span className="block font-mono text-[9px] text-slate-400 font-extrabold uppercase">Emailed Resolution</span>
                            <p className="font-sans text-[11px] text-slate-700 mt-1 leading-normal italic">
                              "{en.replyText}"
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => {
                              setEnquiries(enquiries.map(e => e.id === en.id ? { ...e, status: 'archived' } : e));
                              showToast('Enquiry ticket archived.');
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            Archive
                          </button>
                          <button
                            onClick={() => {
                              setReplyEnquiryId(en.id);
                              setEnquiryReplyText('');
                            }}
                            className="bg-brand-basil text-white font-bold px-4 py-1.5 rounded-xl cursor-pointer"
                          >
                            Resolve / Reply
                          </button>
                        </div>

                        {replyEnquiryId === en.id && (
                          <form onSubmit={handleReplyEnquiry} className="flex gap-2 mt-2">
                            <input 
                              type="text" 
                              required 
                              placeholder="Type official corporate catering resolution..." 
                              className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs flex-1"
                              value={enquiryReplyText}
                              onChange={e => setEnquiryReplyText(e.target.value)}
                            />
                            <button type="submit" className="bg-brand-olive text-brand-saffron font-bold px-4 rounded-xl">
                              SMTP Send
                            </button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: SALES ANALYTICS                                       */}
              {/* ========================================================== */}
              {currentTab === 'analytics' && (
                <div className="flex flex-col gap-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                      HQ Visual Sales Analytics
                    </h3>
                    <p className="font-sans text-[11px] text-slate-400 mt-0.5">Visualize daily, weekly, monthly streams, repeat foodie index percentages, and basket metrics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Growth block */}
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4">
                      <div>
                        <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Weekly Revenue Stream Growth</h4>
                        <span className="font-mono text-[9px] text-slate-400">Time-lapse representing NGN volume indices</span>
                      </div>

                      <div className="w-full h-44 bg-white rounded-2xl p-4 flex flex-col justify-between shadow-inner border border-slate-100">
                        <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                          {[45, 60, 52, 85, 92, 75, 110].map((h, k) => (
                            <div key={k} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[8px] bg-brand-olive text-brand-saffron px-1 rounded">₦{(h * 1000).toLocaleString()}</span>
                              <div className="w-full bg-brand-basil/20 hover:bg-brand-basil transition-colors rounded-t-md" style={{ height: `${h}%` }} />
                              <span className="font-mono text-[9px] text-slate-400">W{k+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Peak Hours visual graph */}
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4">
                      <div>
                        <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Peak Ordering Times (Lagos Time)</h4>
                        <span className="font-mono text-[9px] text-slate-400">Traffic indices on our active servers</span>
                      </div>

                      <div className="w-full h-44 bg-white rounded-2xl p-4 flex flex-col justify-between shadow-inner border border-slate-100">
                        <div className="flex-1 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                          {[20, 25, 45, 95, 40, 60, 90, 30].map((h, k) => (
                            <div key={k} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                              <div className="w-full bg-brand-chili/10 hover:bg-brand-chili transition-colors rounded-t-md" style={{ height: `${h}%` }} />
                              <span className="font-mono text-[8px] text-slate-400">{8 + k*2}h</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Summary list metrics */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                      {[
                        { title: "Average Basket Value", val: "₦12,500", desc: "Platter bundles preferred" },
                        { title: "Customer Growth", val: "+24% MoM", desc: "Organic Lagos outreach" },
                        { title: "Repeat Foodies Index", val: "82.5%", desc: "Highly consistent aroma" },
                        { title: "Cancellation Rate", val: "0.45%", desc: "Excellent dispatch times" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                          <span className="block text-[8px] text-slate-400 font-mono uppercase font-bold">{item.title}</span>
                          <span className="block font-mono text-base font-black text-brand-charcoal mt-1">{item.val}</span>
                          <span className="block text-[10px] text-slate-500 mt-1">{item.desc}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: REPORTS HUB                                           */}
              {/* ========================================================== */}
              {currentTab === 'reports' && (
                <div className="flex flex-col gap-5">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                      Downloadable Operational Reports Hub
                    </h3>
                    <p className="font-sans text-[11px] text-slate-400 mt-0.5">Generate and download certified PDFs or XLS sheets of corporate books.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "Sales Report", desc: "Volumetric indices, average basket size, tax margins.", file: "Bibi_Sales_HQ.pdf" },
                      { title: "Orders Report", desc: "Detailed timeline lifecycle tracking, cancellations.", file: "Bibi_Orders_HQ.pdf" },
                      { title: "Customer Report", desc: "VIP demographic logs, email preference breakdowns.", file: "Bibi_VIP_HQ.pdf" },
                      { title: "Menu Performance", desc: "Volumetric kitchen meal rankings, margins, times.", file: "Bibi_Menu_HQ.pdf" },
                      { title: "Delivery Report", desc: "Courier speed timeline logs, delays gridlock.", file: "Bibi_Logistics_HQ.pdf" },
                      { title: "Revenue Report", desc: "Discount campaign codes metrics, bank reversals.", file: "Bibi_Finance_HQ.pdf" }
                    ].map((rep, idx) => (
                      <div key={idx} className="p-4.5 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div>
                          <span className="font-display font-bold text-xs text-brand-charcoal block">{rep.title}</span>
                          <p className="font-sans text-[11px] text-slate-400 mt-1">{rep.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            showToast(`REPORT DISPATCHED: PDF download initialized for "${rep.file}"`);
                          }}
                          className="bg-[#FAF8F5] hover:bg-brand-basil hover:text-white text-slate-700 border border-slate-200 mt-4 py-2 rounded-xl font-sans text-[10px] font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Download size={12} />
                          <span>Download PDF Placeholder</span>
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: STAFF MANAGEMENT                                      */}
              {/* ========================================================== */}
              {currentTab === 'staff' && (
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        HQ Cloud Staff Management
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Invite, cycle roles, deactivate or edit verified riders, cashiers, managers, or support representatives.</p>
                    </div>

                    <button
                      onClick={() => {
                        setNewStaff({ name: '', email: '', role: 'Kitchen Staff', phone: '' });
                        setIsAddingStaff(true);
                      }}
                      className="bg-brand-olive text-brand-saffron hover:bg-[#131E18] font-display font-bold text-xs uppercase py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Invite Staff</span>
                    </button>
                  </div>

                  {isAddingStaff && (
                    <form onSubmit={handleAddStaff} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Staff Full Name</label>
                        <input 
                          type="text" 
                          required 
                          className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive" 
                          value={newStaff.name}
                          onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Staff Official Email</label>
                        <input 
                          type="email" 
                          required 
                          className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive" 
                          value={newStaff.email}
                          onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Assign Corporate Role</label>
                        <select 
                          className="bg-white border border-slate-200 p-2 rounded-xl focus:outline-brand-olive"
                          value={newStaff.role}
                          onChange={e => setNewStaff({ ...newStaff, role: e.target.value as any })}
                        >
                          <option value="Kitchen Staff">Kitchen Staff</option>
                          <option value="Cashier">Cashier</option>
                          <option value="Manager">Manager</option>
                          <option value="Support Team">Support Team</option>
                          <option value="Rider">Rider (Courier)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Phone Connection</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +234 812..." 
                          className="bg-white border border-slate-200 p-2 rounded-xl" 
                          value={newStaff.phone}
                          onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end gap-2 md:col-span-2 pt-1">
                        <button type="button" onClick={() => setIsAddingStaff(false)} className="px-3 py-1.5 border border-slate-250 rounded-xl">Cancel</button>
                        <button type="submit" className="bg-brand-basil text-white font-bold px-4 rounded-xl">Authorize Staff Member</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staffList.map((st) => (
                      <div key={st.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-display font-bold text-slate-800 text-sm block">{st.name}</span>
                          <span className="block font-mono text-[9px] text-slate-400 mt-0.5">{st.email} • {st.phone}</span>
                          <span className="inline-block font-mono text-[8px] bg-brand-olive/10 text-brand-olive font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1.5">
                            {st.role}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`font-mono text-[8px] font-black uppercase ${st.status === 'active' ? 'text-brand-basil' : 'text-slate-400'}`}>
                            {st.status}
                          </span>
                          <button
                            onClick={() => toggleStaffStatus(st.id)}
                            className={`font-sans font-bold px-2 py-1 rounded-lg border text-[9px] cursor-pointer ${
                              st.status === 'active' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-green-50 border-green-100 text-green-600'
                            }`}
                          >
                            {st.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: SYSTEM SETTINGS                                       */}
              {/* ========================================================== */}
              {currentTab === 'settings' && (
                <div className="flex flex-col gap-5 text-xs font-sans text-slate-600">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                      HQ System Architecture Settings
                    </h3>
                    <p className="font-sans text-[11px] text-slate-400 mt-0.5">Control business operating hours, tax margins, default delivery boundaries, and system backup placeholders.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold">Restaurant Operational Title</label>
                      <input 
                        type="text" 
                        className="bg-white border border-slate-200 p-2.5 rounded-xl" 
                        value={restaurantName}
                        onChange={e => setRestaurantName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Business Hours Start</label>
                        <input 
                          type="time" 
                          className="bg-white border border-slate-200 p-2.5 rounded-xl" 
                          value={businessHoursStart}
                          onChange={e => setBusinessHoursStart(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Business Hours End</label>
                        <input 
                          type="time" 
                          className="bg-white border border-slate-200 p-2.5 rounded-xl" 
                          value={businessHoursEnd}
                          onChange={e => setBusinessHoursEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Value-Added Tax (VAT %)</label>
                        <input 
                          type="number" 
                          className="bg-white border border-slate-200 p-2.5 rounded-xl font-mono" 
                          value={taxPercent}
                          onChange={e => setTaxPercent(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Currency Denomination</label>
                        <input 
                          type="text" 
                          className="bg-white border border-slate-200 p-2.5 rounded-xl" 
                          value={currency}
                          onChange={e => setCurrency(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold">Active Delivery Areas Boundaries</label>
                      <input 
                        type="text" 
                        className="bg-white border border-slate-200 p-2.5 rounded-xl" 
                        value={deliveryAreas}
                        onChange={e => setDeliveryAreas(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          showToast('HQ SYSTEM BACKUP: Stored current JSON snapshot to server log reserves.');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                      >
                        Run System Backup (JSON)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          showToast('System configuration saved safely.');
                        }}
                        className="bg-brand-basil text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                      >
                        Save Configuration
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: LOCK & SECURITY                                       */}
              {/* ========================================================== */}
              {currentTab === 'security' && (
                <div className="flex flex-col gap-5 text-xs font-sans text-slate-600">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                      Admin Password & Security Protocols
                    </h3>
                    <p className="font-sans text-[11px] text-slate-400 mt-0.5">Update access passwords, cycle verification pins, and inspect login security history.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="md:col-span-2 flex flex-col gap-4">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Update Master Password</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold">Current HQ Password</label>
                          <input type="password" placeholder="••••••••" className="bg-white border border-slate-200 p-2.5 rounded-xl" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold">New Secure Password</label>
                          <input type="password" placeholder="••••••••" className="bg-white border border-slate-200 p-2.5 rounded-xl" />
                        </div>
                        <button
                          onClick={() => {
                            showToast('Master HQ password safely updated!');
                          }}
                          className="bg-brand-basil text-white font-bold py-2.5 rounded-xl mt-2 cursor-pointer"
                        >
                          Cycle Security Key
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-3">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Security Logs</h4>
                      <div className="flex flex-col gap-2.5 font-mono text-[9px] text-slate-400">
                        <div className="p-2 bg-white rounded-lg border border-slate-100">
                          <span className="block text-brand-basil font-bold">● Admin Session Authorized</span>
                          <span>IP: 192.168.1.15 • Today, 07:19</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-100">
                          <span className="block text-slate-500 font-bold">● Password cycled successfully</span>
                          <span>IP: 192.168.1.15 • 2 weeks ago</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>

      </div>

    </div>
  );
}
