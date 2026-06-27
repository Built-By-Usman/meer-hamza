'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, ShoppingBag, Heart, Settings, LayoutDashboard, LogOut, CheckCircle2, Package, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Rating } from '@/components/common/Rating';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { useUserOrders } from '@/features/shared/hooks/queries';
import { useAuthStore } from '@/store/auth';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

export function ProfileClient() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  // Fetch orders for logged-in user, default to usr-2 in mock if none or guest for simulation
  const targetUserId = user?.id || 'usr-2';
  const { data: orders, isLoading: isLoadingOrders } = useUserOrders(targetUserId);

  // Sync tab route parameter if passed (e.g. ?tab=wishlist)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleMoveToCart = (product: any) => {
    addToCart(product, product.variants?.[0], 1);
    removeFromWishlist(product.id);
    toast.success(`Moved ${product.name} to Shopping Cart`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Info Row */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4 border-b pb-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center border overflow-hidden relative">
              {isAuthenticated && user?.avatar ? (
                <OptimizedImage src={user.avatar} alt={user.firstName} fill />
              ) : (
                <UserIcon className="h-8 w-8 text-muted-foreground stroke-[1.5]" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {isAuthenticated && user ? `Hello, ${user.firstName}!` : 'Account Dashboard'}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {isAuthenticated && user ? user.email : 'Log in to track orders and save your wishlist.'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full cursor-pointer text-xs font-semibold gap-1.5">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </Button>
            ) : (
              <Button size="sm" onClick={() => setIsAuthModalOpen(true)} className="rounded-full cursor-pointer text-xs font-semibold">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs Grid */}
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar List */}
          <TabsList className="flex flex-col h-auto bg-transparent border rounded-xl p-2 space-y-1 w-full md:col-span-1 border-border/80 self-start">
            <TabsTrigger value="dashboard" className="w-full justify-start font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" className="w-full justify-start font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Order History
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="w-full justify-start font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <Heart className="h-4 w-4" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full justify-start font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Panels content (Right) */}
          <div className="md:col-span-3 space-y-6">
            {/* T1: DASHBOARD SUMMARY */}
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="rounded-xl border shadow-xs text-left">
                  <CardContent className="p-5 flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Total Orders</p>
                      <p className="text-xl font-bold">{isAuthenticated ? orders?.length || 0 : 2}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border shadow-xs text-left">
                  <CardContent className="p-5 flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Wishlisted</p>
                      <p className="text-xl font-bold">{wishlistItems.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border shadow-xs text-left">
                  <CardContent className="p-5 flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Coupons Active</p>
                      <p className="text-xl font-bold">4</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {!isAuthenticated ? (
                <div className="border border-dashed rounded-xl p-8 text-center bg-card/25 max-w-lg mx-auto">
                  <UserIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-base">You are viewing this panel as a Guest</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Sign in using the demo account to view personal order trackers and checkout histories.</p>
                  <Button onClick={() => setIsAuthModalOpen(true)} className="mt-4 rounded-md cursor-pointer font-bold size-sm">
                    Sign In Demo Account
                  </Button>
                </div>
              ) : (
                <Card className="rounded-xl border text-left">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-base border-b pb-2 flex items-center gap-1.5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Account Active</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm leading-normal">
                      <div>Name: <span className="font-semibold text-foreground">{user?.firstName} {user?.lastName}</span></div>
                      <div>Email: <span className="font-semibold text-foreground">{user?.email}</span></div>
                      <div>Role privileges: <span className="font-semibold text-foreground capitalize">{user?.role}</span></div>
                      <div>Member since: <span className="font-semibold text-foreground">June 2026</span></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* T2: ORDERS HISTORY LOGS */}
            <TabsContent value="orders">
              {isLoadingOrders ? (
                <Loader />
              ) : orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((ord) => {
                    const estDate = new Date(ord.createdAt);
                    estDate.setDate(estDate.getDate() + 5);

                    return (
                      <Card key={ord.id} className="rounded-xl border shadow-sm text-left overflow-hidden">
                        {/* Order Header banner */}
                        <div className="bg-secondary/15 border-b p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold">Order ID</div>
                            <div className="text-sm font-bold text-foreground">{ord.id}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold">Placed Date</div>
                            <div className="text-xs font-semibold text-foreground">{new Date(ord.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold">Total Amount</div>
                            <div className="text-sm font-extrabold text-foreground">${ord.total.toFixed(2)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold">Tracking Number</div>
                            <div className="text-xs font-semibold text-foreground">{ord.trackingNumber || 'Pending'}</div>
                          </div>
                          <Badge variant={ord.status === 'delivered' ? 'success' : 'warning'} className="font-bold text-[9px] uppercase tracking-wider py-0.5 h-6">
                            {ord.status}
                          </Badge>
                        </div>

                        {/* Order Body info */}
                        <div className="p-5 space-y-4">
                          {/* Products purchased list */}
                          <div className="space-y-3">
                            {ord.items.map((item) => (
                              <div key={`${item.productId}-${item.variantId || ''}`} className="flex items-center text-xs">
                                <div className="relative h-10 w-10 border rounded bg-secondary flex-shrink-0">
                                  <OptimizedImage src={item.image} alt={item.name} fill />
                                </div>
                                <div className="ml-3 flex-grow min-w-0">
                                  <p className="font-semibold text-foreground truncate">{item.name}</p>
                                  {item.attributes && Object.keys(item.attributes).length > 0 && (
                                    <p className="text-[10px] text-muted-foreground">
                                      {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                                    </p>
                                  )}
                                  <p className="text-[10px] text-muted-foreground">Qty: {item.quantity} · ${item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Shipment details */}
                          <div className="border-t pt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-3">
                            <div className="flex items-center space-x-1 font-semibold">
                              <Package className="h-4 w-4 text-primary" />
                              <span>Carrier: {ord.shippingMethod}</span>
                            </div>
                            <div className="flex items-center space-x-1 font-semibold">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                              <span>Est Delivery: {estDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No orders found"
                  description="You have not placed any orders yet. Once you complete a purchase, your receipt invoices will tracking details will appear here."
                  actionLabel="Go Shop Catalog"
                  onAction={() => router.push('/category/all')}
                />
              )}
            </TabsContent>

            {/* T3: WISHLIST PRODUCTS */}
            <TabsContent value="wishlist">
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((prod) => (
                    <Card key={prod.id} className="rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 text-left">
                      <div className="space-y-3">
                        <div className="relative aspect-square w-full bg-secondary rounded-lg overflow-hidden border">
                          <OptimizedImage src={prod.images[0]} alt={prod.name} fill />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{prod.brand}</span>
                          <h4 className="font-semibold text-sm leading-snug line-clamp-1 mt-0.5">{prod.name}</h4>
                          <div className="flex items-center space-x-1.5 mt-1">
                            <Rating rating={prod.rating} size={11} />
                            <span className="text-[10px] text-muted-foreground">({prod.reviewsCount})</span>
                          </div>
                          <p className="text-sm font-bold text-foreground mt-1">${prod.basePrice}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => removeFromWishlist(prod.id)} className="text-xs py-1 h-8 cursor-pointer">
                          Remove
                        </Button>
                        <Button size="sm" onClick={() => handleMoveToCart(prod)} className="text-xs py-1 h-8 cursor-pointer">
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Your Wishlist is empty"
                  description="Save products to your wishlist while browsing, and they will appear here for easy access later."
                  actionLabel="Discover Products"
                  onAction={() => router.push('/category/all')}
                />
              )}
            </TabsContent>

            {/* T4: ACCOUNT SETTINGS (LOCALIZATION i18n & PWAs) */}
            <TabsContent value="settings">
              <Card className="rounded-xl border text-left">
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-bold text-lg border-b pb-3 flex items-center gap-1.5"><Settings className="h-5 w-5 text-muted-foreground" /> Account Configurations</h3>

                  {/* i18n Currency / Language scaffold */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Localization (i18n Skeleton)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Active Currency</label>
                        <Select defaultValue="usd" onChange={() => toast.success('Active Currency switched', { description: 'Updated exchange rates applied.' })}>
                          <option value="usd">USD ($) - US Dollars</option>
                          <option value="eur">EUR (€) - Euro</option>
                          <option value="gbp">GBP (£) - British Pounds</option>
                          <option value="pkr">PKR (Rs) - Pakistani Rupee</option>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Preferred Language</label>
                        <Select defaultValue="en" onChange={() => toast.success('Preferred Language swapped', { description: 'Applying localization dictionaries.' })}>
                          <option value="en">English (US)</option>
                          <option value="es">Español (Spanish)</option>
                          <option value="ur">Urdu (اردو)</option>
                          <option value="fr">Français (French)</option>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* PWA offline / manifest configuration settings */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mobile Web Application (PWA Status)</h4>
                    <div className="flex justify-between items-center p-3 border rounded-none bg-secondary/10">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold font-sans">Offline App Installer</p>
                        <p className="text-xs text-muted-foreground font-sans">Add Meer Hamza Store to your desktop or mobile home screen</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info('Meer Hamza Maison is installable!', { description: 'Click the install icon in your browser URL bar.' })} className="cursor-pointer font-bold text-xs h-8 rounded-none">
                        Install App
                      </Button>
                    </div>
                  </div>

                  {/* Security options */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Communication Preferences</h4>
                    <label className="flex items-center space-x-3 text-sm cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" onChange={(e) => toast.info(`Newsletter alerts: ${e.target.checked ? 'Enabled' : 'Disabled'}`)} />
                      <span>Receive email notifications for order status, tracking updates, and delivery confirmations.</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Login modal trigger */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Footer />
    </div>
  );
}
