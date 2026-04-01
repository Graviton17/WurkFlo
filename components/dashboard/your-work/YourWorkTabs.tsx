import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface YourWorkTabsProps {
  children?: React.ReactNode;
}

export function YourWorkTabs({ children }: YourWorkTabsProps) {
  return (
    <div className="w-full px-8">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none p-0 h-auto gap-6 mb-8">
          <TabsTrigger 
            value="summary" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4da1ff] data-[state=active]:text-[#4da1ff] rounded-none py-2 px-0 text-[#888] font-medium text-[0.85rem]"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger 
            value="assigned" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4da1ff] data-[state=active]:text-[#4da1ff] rounded-none py-2 px-0 text-[#888] font-medium text-[0.85rem]"
          >
            Assigned
          </TabsTrigger>
          <TabsTrigger 
            value="created" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4da1ff] data-[state=active]:text-[#4da1ff] rounded-none py-2 px-0 text-[#888] font-medium text-[0.85rem]"
          >
            Created
          </TabsTrigger>
          <TabsTrigger 
            value="subscribed" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4da1ff] data-[state=active]:text-[#4da1ff] rounded-none py-2 px-0 text-[#888] font-medium text-[0.85rem]"
          >
            Subscribed
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4da1ff] data-[state=active]:text-[#4da1ff] rounded-none py-2 px-0 text-[#888] font-medium text-[0.85rem]"
          >
            Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-0 outline-none">
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
}
