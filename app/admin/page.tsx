"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  Send,
  Download,
  Eye,
  Shield,
  Activity,
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  totalBookings: number
  highRiskUsers: number
  weeklyGrowth: number
}

interface Student {
  id: string
  name: string
  email: string
  lastActive: string
  riskLevel: "low" | "moderate" | "high" | "critical"
  totalSessions: number
  guardianEmail?: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" })
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [reportContent, setReportContent] = useState("")
  const [reportType, setReportType] = useState("weekly")
  const router = useRouter()

  // Mock admin credentials (in production, this would be handled securely)
  const ADMIN_USERNAME = "admin@mindwell.edu"
  const ADMIN_PASSWORD = "MindWell2024!"

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminCredentials.username === ADMIN_USERNAME && adminCredentials.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert("Invalid admin credentials")
    }
  }

  const loadDashboardData = () => {
    // Mock data - in production, this would come from your API
    setStats({
      totalUsers: 1247,
      activeUsers: 892,
      totalSessions: 3456,
      totalBookings: 234,
      highRiskUsers: 23,
      weeklyGrowth: 12.5,
    })

    setStudents([
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.j@university.edu",
        lastActive: "2024-01-15T10:30:00Z",
        riskLevel: "high",
        totalSessions: 15,
        guardianEmail: "parent.sarah@email.com",
      },
      {
        id: "2",
        name: "Michael Chen",
        email: "m.chen@university.edu",
        lastActive: "2024-01-15T14:20:00Z",
        riskLevel: "moderate",
        totalSessions: 8,
        guardianEmail: "chen.parents@email.com",
      },
      {
        id: "3",
        name: "Emma Rodriguez",
        email: "emma.r@university.edu",
        lastActive: "2024-01-15T09:15:00Z",
        riskLevel: "critical",
        totalSessions: 22,
        guardianEmail: "rodriguez.family@email.com",
      },
      {
        id: "4",
        name: "David Kim",
        email: "d.kim@university.edu",
        lastActive: "2024-01-14T16:45:00Z",
        riskLevel: "low",
        totalSessions: 3,
        guardianEmail: "kim.parents@email.com",
      },
      {
        id: "5",
        name: "Lisa Thompson",
        email: "lisa.t@university.edu",
        lastActive: "2024-01-15T11:30:00Z",
        riskLevel: "moderate",
        totalSessions: 12,
        guardianEmail: "thompson.family@email.com",
      },
    ])
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "moderate":
        return "secondary"
      default:
        return "default"
    }
  }

  const generateReport = (student: Student) => {
    const template = `MENTAL HEALTH PROGRESS REPORT

Student Information:
- Name: ${student.name}
- Email: ${student.email}
- Current Risk Level: ${student.riskLevel.toUpperCase()}
- Total Sessions: ${student.totalSessions}
- Last Active: ${new Date(student.lastActive).toLocaleDateString()}

Summary:
${student.name} has been actively engaging with our mental health support platform. Based on their interaction patterns and session data, their current risk assessment is ${student.riskLevel}.

Recommendations:
${
  student.riskLevel === "critical"
    ? "- Immediate professional intervention recommended\n- Consider emergency contact protocols\n- Schedule urgent counseling session"
    : student.riskLevel === "high"
      ? "- Increased monitoring recommended\n- Schedule regular check-ins\n- Consider additional support resources"
      : student.riskLevel === "moderate"
        ? "- Continue current support level\n- Monitor for changes\n- Encourage continued engagement"
        : "- Maintain current support level\n- Encourage preventive care\n- Regular wellness check-ins"
}

This report is generated automatically and should be reviewed by qualified mental health professionals.

Generated on: ${new Date().toLocaleDateString()}
Platform: MindWell Mental Health Support System`

    setReportContent(template)
  }

  const sendReportToGuardian = (student: Student) => {
    if (!student.guardianEmail) {
      alert("No guardian email on file for this student")
      return
    }

    // In production, this would send an actual email
    alert(`Report sent to ${student.guardianEmail} for ${student.name}`)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-cyan-600" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter admin credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="admin@mindwell.edu"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">MindWell Mental Health Platform</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Active this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Total AI sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Counselor appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats?.highRiskUsers}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats?.weeklyGrowth}%</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>Monitor student engagement and risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Last active: {new Date(student.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getRiskLevelColor(student.riskLevel)}>{student.riskLevel}</Badge>
                        <span className="text-sm text-muted-foreground">{student.totalSessions} sessions</span>
                        <Button size="sm" variant="outline" onClick={() => setSelectedStudent(student)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Detail Modal */}
            {selectedStudent && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Details: {selectedStudent.name}</CardTitle>
                  <CardDescription>Generate and send reports to guardians</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Report Type</Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly Progress</SelectItem>
                          <SelectItem value="monthly">Monthly Summary</SelectItem>
                          <SelectItem value="incident">Incident Report</SelectItem>
                          <SelectItem value="custom">Custom Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end space-x-2">
                      <Button onClick={() => generateReport(selectedStudent)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Report
                      </Button>
                    </div>
                  </div>

                  {reportContent && (
                    <div className="space-y-2">
                      <Label>Generated Report</Label>
                      <Textarea
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        rows={12}
                        className="font-mono text-sm"
                      />
                      <div className="flex space-x-2">
                        <Button onClick={() => sendReportToGuardian(selectedStudent)}>
                          <Send className="h-4 w-4 mr-1" />
                          Send to Guardian
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                    Close
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Platform engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-medium">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Session Duration</span>
                      <span className="font-medium">12.5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crisis Interventions</span>
                      <span className="font-medium text-destructive">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful Referrals</span>
                      <span className="font-medium text-green-600">28</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Current student risk levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Low Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-16 h-2 bg-green-500 rounded"></div>
                        </div>
                        <span className="text-sm">80%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Moderate Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-3 h-2 bg-yellow-500 rounded"></div>
                        </div>
                        <span className="text-sm">15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>High Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-1 h-2 bg-red-500 rounded"></div>
                        </div>
                        <span className="text-sm">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage platform settings and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Crisis Alert Threshold</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Auto-Report Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
