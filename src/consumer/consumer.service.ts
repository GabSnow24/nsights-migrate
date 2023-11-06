import { InjectQueue, OnGlobalQueueCompleted, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { Job, Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';


@Processor('nsights')
export class ConsumerService {
  constructor(@InjectQueue('nsights') private queue: Queue, private readonly prisma: PrismaService) { }

  @Process("migrate")
  @OnQueueActive()
  async createByFile(job: Job) {
    const data = JSON.parse(job.data)
    const enterpriseData = data.data
    try {
      const foundedEnterprise = await this.prisma.enterprise.findFirst({
        where: {
          website: enterpriseData.website,
        }
      })

      if (foundedEnterprise) {
        Logger.log(`(Migrate) on abort, enterprise founded: ${job}, ${foundedEnterprise} `)
        return
      }

      const enterpriseCreated = await this.prisma.enterprise.create({
        data: enterpriseData
      })


      Logger.log(`(Migrate) on completed: ${job}, ${enterpriseCreated} `)
      return enterpriseCreated
    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("updateImage")
  @OnQueueActive()
  async updateImage(job: Job) {
    const data = JSON.parse(job.data)
    const imageData = data.data
    try {
      const foundedEnterprise = await this.prisma.enterprise.findFirst({
        where: {
          website: imageData.website,
        }
      })

      if (foundedEnterprise) {
        await this.prisma.enterprise.update({
          data: {
            ...foundedEnterprise,
            imageUrl: imageData.url
          },
          where: {
            id: foundedEnterprise.id
          }
        })
      } else {
        Logger.log(`(Update images) none to update: ${job} `)
        return
      }


      Logger.log(`(Update images) on completed: ${job}, ${foundedEnterprise} `)
      return foundedEnterprise
    } catch (error) {
      Logger.error(error)
    }
  }


  @Process("lastMonth")
  @OnQueueActive()
  async createViewLastMonth(job: Job) {
    const curr = new Date;
    const first = curr.getDate() - curr.getDay();
    const last = first - 31;
    const startDate = new Date(curr.setDate(first));
    const endDate = new Date(curr.setDate(last));
    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        where: {
          foundedDate: {
            lte: startDate,
            gte: endDate,
          }
        },
        orderBy: {
          foundedDate: "asc"
        }

      })
      let index = 0

      const groupedEnterprises = foundEnterprise.reduce((acc, obj) => {

        const day = obj.foundedDate.toISOString().split("T")[0].split("-")[2]
        const month = obj.foundedDate.toISOString().split("T")[0].split("-")[1]
        const year = obj.foundedDate.toISOString().split("T")[0].split("-")[0]

        let key = `${day}-${month}-${year}`;
        if (!acc[index]) {
          acc[index] = { count: 1, date: key };
          return acc
        }
        if (acc[index].date === key) {

          acc[index] = { ...acc[index], count: acc[index].count + 1 };
          return acc
        } else {
          index++
          acc[index] = { count: 1, date: key };
        }
        return acc;
      }, [])

      await this.prisma.viewLastMonth.createMany({
        data: groupedEnterprises
      })

      Logger.log(`(Migrate) on completed: ${job}, ${groupedEnterprises} `)
      return groupedEnterprises

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("foundedDate")
  @OnQueueActive()
  async createViewFoundedDate(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          foundedDate: "asc"
        }
      })
      let index = 0

      const groupedEnterprises = foundEnterprise.reduce((acc, obj) => {

        const day = obj.foundedDate.toISOString().split("T")[0].split("-")[2]
        const month = obj.foundedDate.toISOString().split("T")[0].split("-")[1]
        const year = obj.foundedDate.toISOString().split("T")[0].split("-")[0]

        let key = `${day}-${month}-${year}`;
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])

      await this.prisma.viewFoundedDate.createMany({
        data: groupedEnterprises
      })

      Logger.log(`(Migrate) on completed: ${job}, ${groupedEnterprises} `)
      return groupedEnterprises

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("country")
  @OnQueueActive()
  async createViewCountry(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          country: "asc"
        }
      })

      let index = 0

      const groupedEnterprises = foundEnterprise.reduce((acc, obj) => {
        let key = obj.country
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])

      await this.prisma.viewCountry.createMany({
        data: groupedEnterprises
      })

      Logger.log(`(Migrate) on completed: ${job}, ${groupedEnterprises} `)
      return groupedEnterprises

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("numberOfEmployees")
  @OnQueueActive()
  async createViewNumberOfEmployees(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          employeesRange: "asc"
        }
      })

      let index = 0

      const groupedEnterprises = foundEnterprise.reduce((acc, obj) => {
        let key = obj.employeesRange
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])

      await this.prisma.viewNumberEmployees.createMany({
        data: groupedEnterprises
      })

      Logger.log(`(Migrate) on completed: ${job}, ${groupedEnterprises} `)
      return groupedEnterprises

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("fundingRounds")
  @OnQueueActive()
  async createViewFundingRounds(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          numberOfFundingRounds: "asc"
        }
      })

      let index = 0

      const groupedEnterprises = foundEnterprise.reduce((acc, obj) => {
        let key = obj.numberOfFundingRounds
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])
      groupedEnterprises[0].x = "None"

      const result = Object.values(
        groupedEnterprises.reduce((acc, item) => {
          acc[item.x] = acc[item.x]
            ? { ...item, y: item.y + acc[item.x].y }
            : item;
          return acc;
        }, {})
      );

      await this.prisma.viewFundingRounds.createMany({
        data: result as { x: string, y: number }[]
      })

      Logger.log(`(Migrate) on completed: ${job}, ${result} `)
      return result

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("industry")
  @OnQueueActive()
  async createViewIndustry(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          industries: "asc"
        }
      })

      let index = 0
      let allIndustries = []
      foundEnterprise.forEach((enterprise) => {
        enterprise.industries.forEach((industry) => {
          allIndustries.push(industry)
        })
      })
      const groupedEnterprises = allIndustries.reduce((acc, obj) => {
        let key = obj.trim()
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])

      const result = Object.values(
        groupedEnterprises.reduce((acc, item) => {
          acc[item.x] = acc[item.x]
            ? { ...item, y: item.y + acc[item.x].y }
            : item;
          return acc;
        }, {})
      );

      await this.prisma.viewIndustry.createMany({
        data: result as { x: string, y: number }[]
      })

      Logger.log(`(Migrate) on completed: ${job}, ${result} `)
      return result

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("industryGroups")
  @OnQueueActive()
  async createViewIndustryGroups(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          industryGroups: "asc"
        }
      })

      let index = 0
      let allIndustries = []
      foundEnterprise.forEach((enterprise) => {
        enterprise.industryGroups.forEach((industry) => {
          allIndustries.push(industry)
        })
      })
      const groupedEnterprises = allIndustries.reduce((acc, obj) => {
        let key = obj.trim()
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])

      const result = Object.values(
        groupedEnterprises.reduce((acc, item) => {
          acc[item.x] = acc[item.x]
            ? { ...item, y: item.y + acc[item.x].y }
            : item;
          return acc;
        }, {})
      );
      await this.prisma.viewIndustryGroups.createMany({
        data: result as { x: string, y: number }[]
      })

      Logger.log(`(Migrate) on completed: ${job}, ${result} `)
      return result

    } catch (error) {
      Logger.error(error)
    }
  }

  @Process("region")
  @OnQueueActive()
  async createViewRegion(job: Job) {

    try {
      const foundEnterprise = await this.prisma.enterprise.findMany({
        orderBy: {
          country: "asc"
        },
      })

      let index = 0

      const groupedEnterprises = foundEnterprise.reduce((acc, obj) => {
        let key = obj.headquartersRegions
        if (!acc[index]) {
          acc[index] = { y: 1, x: key };
          return acc
        }
        if (acc[index].x === key) {

          acc[index] = { ...acc[index], y: acc[index].y + 1 };
          return acc
        } else {
          index++
          acc[index] = { y: 1, x: key };
        }
        return acc;
      }, [])

      const result = Object.values(
        groupedEnterprises.reduce((acc, item) => {
          acc[item.x] = acc[item.x]
            ? { ...item, y: item.y + acc[item.x].y }
            : item;
          return acc;
        }, {})
      );

      await this.prisma.viewRegion.createMany({
        data: result as { x: string, y: number }[]
      })

      Logger.log(`(Migrate) on completed: ${job}, ${result} `)
      return result

    } catch (error) {
      Logger.error(error)
    }
  }


  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    const job = await this.queue.getJob(jobId);
    Logger.log(`(Global) on completed: ${job} , ${job.id},  -> result: , ${result}`);
  }

}


