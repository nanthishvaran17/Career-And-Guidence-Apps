import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Bell, 
  BookOpen, 
  Briefcase,
  Award,
  Check,
  Trash2,
  Calendar,
  CheckCheck
} from 'lucide-react';
import { notifications as mockNotifications, type Notification } from '../data/mockData';

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'exam':
        return <BookOpen className="w-5 h-5" />;
      case 'job':
        return <Briefcase className="w-5 h-5" />;
      case 'scholarship':
        return <Award className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'exam':
        return 'blue';
      case 'job':
        return 'green';
      case 'scholarship':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2">Notifications</h2>
            <p className="text-gray-600">
              Stay updated with exams, jobs, scholarships, and more
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl mb-1">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-center">
              <div className="text-2xl text-blue-600 mb-1">{unreadCount}</div>
              <div className="text-sm text-blue-700">Unread</div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <div className="text-2xl text-green-600 mb-1">
                {notifications.filter(n => n.type === 'job').length}
              </div>
              <div className="text-sm text-green-700">Jobs</div>
            </div>
          </Card>
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="text-center">
              <div className="text-2xl text-yellow-600 mb-1">
                {notifications.filter(n => n.type === 'scholarship').length}
              </div>
              <div className="text-sm text-yellow-700">Scholarships</div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-blue-600">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="exam">
              Exams
            </TabsTrigger>
            <TabsTrigger value="job">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="scholarship">
              Scholarships
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const color = getNotificationColor(notification.type);
                
                return (
                  <Card
                    key={notification.id}
                    className={`p-5 transition-all ${
                      notification.read ? 'opacity-60' : 'shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
                        <div className={`text-${color}-600`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="line-clamp-1">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(notification.date)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="mb-2 text-gray-500">No notifications</h4>
                <p className="text-sm text-gray-400">
                  {activeTab === 'all' 
                    ? "You're all caught up!"
                    : `No ${activeTab} notifications at the moment.`}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
