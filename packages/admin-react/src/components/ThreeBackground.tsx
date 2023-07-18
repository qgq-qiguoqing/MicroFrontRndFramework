import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import _ from 'lodash'
import './bg.css'
const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 容器
    let container: any
    // 声明视口宽度
    let width: number
    // 声明视口高度
    let height: number
    // 盒模型的深度
    const depth = 1400
    // 声明场景
    let scene: any
    // 声明球组
    let Sphere_Group: any
    // 声明球体几何
    let sphereGeometry: any
    // 声明完整球
    let sphere: any
    // 声明相机
    let camera: any
    // 声明相机在z轴的位置
    let zAxisNumber: number = 0
    // 声明相机目标点
    let cameraTarget: any = new THREE.Vector3(0, 0, 0)
    // 声明点材质
    let materials: any = []
    // 声明点的参数
    let parameters: any
    // 声明点在z轴上移动的进度
    let zprogress: number
    // 声明同上（第二个几何点）
    let zprogress_second: number
    // 声明粒子1
    let particles_first: any[]
    // 声明粒子1
    let particles_second: any[]
    // 声明粒子1的初始化位置
    let particles_init_position: number
    // 声明流动的云对象1（包含路径、云实例）
    let cloudParameter_first: any
    // 声明流动的云对象2（包含路径、云实例）
    let cloudParameter_second: any
    // 声明云流动的渲染函数1
    let renderCloudMove_first: any
    // 声明云流动的渲染函数1
    let renderCloudMove_second: any
    // 声明性能监控
    let stats: any = new Stats()
    // 声明渲染器
    let renderer: any
    // 声明调试工具
    // let gui = new GUI()
    // function Params() {
    //   return {
    //     color: '#000',
    //     length: 10,
    //     size: 3,
    //     visible: true,
    //     x: 0,
    //     y: 0,
    //     z: 100,
    //     widthSegments: 64,
    //     heightSegments: 32,
    //     radius: 16,
    //   }
    // }

    // 初始化gui
    // const initGUI = () => {
    //   const params = { ...Params() }
    //   gui.add(params, 'x', -1500, 1500).onChange((x: number) => {
    //     //点击颜色面板，e为返回的10进制颜色
    //     Sphere_Group.position.x = x
    //   })
    //   gui.add(params, 'y', -50, 1500).onChange((y: number) => {
    //     //点击颜色面板，e为返回的10进制颜色
    //     Sphere_Group.position.y = y
    //   })
    //   gui.add(params, 'z', -200, 1000).onChange((z: number) => {
    //     //点击颜色面板，e为返回的10进制颜色
    //     Sphere_Group.position.z = z
    //   })
    //   gui
    //     .add(params, 'widthSegments', 0, 64)
    //     .onChange((widthSegments: number) => {
    //       //点击颜色面板，e为返回的10进制颜色
    //       sphereGeometry.parameters.widthSegments = widthSegments
    //     })
    //   gui
    //     .add(params, 'heightSegments', 0, 32)
    //     .onChange((heightSegments: number) => {
    //       //点击颜色面板，e为返回的10进制颜色
    //       sphereGeometry.parameters.heightSegments = heightSegments
    //     })
    //   gui.add(params, 'radius', 5, 30).onChange((radius: number) => {
    //     //点击颜色面板，e为返回的10进制颜色
    //     sphereGeometry.parameters.radius = radius
    //     renderer.render(scene, camera)
    //   })
    //   gui.add(params, 'visible').onChange((e) => {
    //     //这是一个单选框，因为params.visible是一个布尔值，e返回所选布尔值
    //     // points.visible = e
    //   })
    //   gui.addColor(params, 'color').onChange((e) => {
    //     //点击颜色面板，e为返回的10进制颜色
    //     // pointsMaterial.color.set(e)
    //   })
    // }

    // 初始化场景
    const initScene = () => {
      scene = new THREE.Scene()
      // 在场景中添加雾的效果，Fog参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
      scene.fog = new THREE.Fog(0x000000, 0, 10000)
    }

    // 初始化背景（盒模型背景，视角在盒子里面，看到的是盒子内部）
    const initSceneBg = () => {
      new THREE.TextureLoader().load('/images/sky.png', (texture: any) => {
        const geometry = new THREE.BoxGeometry(width, height, depth) // 创建一个球形几何体 SphereGeometry
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide,
        }) // 创建基础为网格基础材料
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      })
    }

    // 初始化轨道控制器
    const initOrbitControls = () => {
      const controls = new OrbitControls(camera, renderer.domElement)
      // enabled设置为true是可以使用鼠标控制视角
      controls.enabled = false
      controls.update()
    }

    // 初始化相机
    const initCamera = () => {
      /**
       * 方式1：固定视野的距离，求满足完整的视野画面需要多大的视域角度
       * tan正切值（直角边除以临边）
       * const mathTan_value = width / 2 / depth
       * 视域角度
       * const fov_angle = (Math.atan(mathTan_value) * 180) / Math.PI
       * 创建透视相机
       * new THREE.PerspectiveCamera(fov_angle, width / height, 1, depth)
       * 场景是一个矩形容器（坐标(0, 0, 0)是矩形容器的中心），相机能看到的距离是depth，
       * camera.position.set(0, 0, depth / 2)
       */

      /**
       * 使用透视相机
       * 参数值分别是：
       * fov（field of view） — 摄像机视锥体垂直视野角度
       * aspect — 摄像机视锥体长宽比
       * near — 摄像机视锥体近端面
       * far — 摄像机视锥体远端面
       * 这里需要注意：透视相机是鱼眼效果，如果视域越大，边缘变形越大。
       * 为了避免边缘变形，可以将fov角度设置小一些，距离拉远一些
       */

      /**
       * 方式2:固定视域角度，求需要多少距离才能满足完整的视野画面
       * 15度等于(Math.PI / 12)
       */
      const fov = 15
      const distance = width / 2 / Math.tan(Math.PI / 12)
      zAxisNumber = Math.floor(distance - depth / 2)
      camera = new THREE.PerspectiveCamera(fov, width / height, 1, 30000)
      /**
       * 这里给z轴的距离加了100，原因是做调整，使得视域更完整
       * 这么做并不代表前面计算错误了，根据前面的计算值并不能很完整的看到
       * 至于原因，我想大概就类似于0.1+0.2不等于0.3吧
       * 所以我自作主张地加了100的值做调整（但是不建议，因为当屏幕足够宽时候会看到边缘）
       */
      // camera.position.set(0, 0, zAxisNumber + 100)
      camera.position.set(0, 0, zAxisNumber)
      camera.lookAt(cameraTarget)
      // const helper = new THREE.CameraHelper(camera)
      // helper.update()
      // scene.add(helper)
    }

    //光源
    const initLight = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 1)
      // 右下角点光源
      const light_rightBottom = new THREE.PointLight(0x0655fd, 5, 0)
      light_rightBottom.position.set(0, 100, -200)
      scene.add(light_rightBottom)
      scene.add(ambientLight)
    }

    // 初始化球体模型
    const initSphereModal = () => {
      //材质
      let material = new THREE.MeshPhongMaterial()
      material.map = new THREE.TextureLoader().load('/images/earth_bg.png')
      material.blendDstAlpha = 1
      //几何体
      sphereGeometry = new THREE.SphereGeometry(50, 64, 32)
      //模型
      sphere = new THREE.Mesh(sphereGeometry, material)
    }

    // 初始化组 --- 球体
    const initSphereGroup = () => {
      Sphere_Group = new THREE.Group()
      Sphere_Group.add(sphere)
      Sphere_Group.position.x = -400
      Sphere_Group.position.y = 200
      Sphere_Group.position.z = -200
      scene.add(Sphere_Group)
    }

    // 初始化流动路径
    const initTubeRoute = (
      route?: any,
      geometryWidth?: number,
      geometryHeigh?: number
    ) => {
      const curve = new THREE.CatmullRomCurve3(route, false)
      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 50, false)
      const tubeMaterial = new THREE.MeshBasicMaterial({
        // color: '0x4488ff',
        opacity: 0,
        transparent: true,
      })
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      scene.add(tube)

      const clondGeometry = new THREE.PlaneGeometry(
        geometryWidth,
        geometryHeigh
      )
      const textureLoader = new THREE.TextureLoader()
      const cloudTexture = textureLoader.load('/images/cloud.png')
      const clondMaterial = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      })
      const cloud = new THREE.Mesh(clondGeometry, clondMaterial)
      scene.add(cloud)
      return {
        cloud,
        curve,
      }
    }

    // 初始化场景星星效果
    const initSceneStar = (initZposition: number): any => {
      const geometry = new THREE.BufferGeometry()
      const vertices: number[] = []
      const pointsGeometry: any[] = []
      const textureLoader = new THREE.TextureLoader()
      const sprite1 = textureLoader.load('/images/starflake1.png')
      const sprite2 = textureLoader.load('/images/starflake2.png')
      parameters = [
        [[0.6, 100, 0.75], sprite1, 50],
        [[0, 0, 1], sprite2, 20],
      ]
      // 初始化500个节点
      for (let i = 0; i < 500; i++) {
        /**
         * const x: number = Math.random() * 2 * width - width
         * 等价
         * THREE.MathUtils.randFloatSpread(width)
         */
        const x: number = THREE.MathUtils.randFloatSpread(width)
        const y: number = _.random(0, height / 2)
        const z: number = _.random(-depth / 2, zAxisNumber)
        vertices.push(x, y, z)
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      )

      // 创建2种不同的材质的节点（500 * 2）
      for (let i = 0; i < parameters.length; i++) {
        const color = parameters[i][0]
        const sprite = parameters[i][1]
        const size = parameters[i][2]

        materials[i] = new THREE.PointsMaterial({
          size,
          map: sprite,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          transparent: true,
        })
        materials[i].color.setHSL(color[0], color[1], color[2])
        const particles = new THREE.Points(geometry, materials[i])
        particles.rotation.x = Math.random() * 0.2 - 0.15
        particles.rotation.z = Math.random() * 0.2 - 0.15
        particles.rotation.y = Math.random() * 0.2 - 0.15
        particles.position.setZ(initZposition)
        pointsGeometry.push(particles)
        scene.add(particles)
      }
      return pointsGeometry
    }

    // 渲染星球的自转
    const renderSphereRotate = () => {
      if (sphere) {
        Sphere_Group.rotateY(0.001)
      }
    }

    // 渲染星星的运动
    const renderStarMove = () => {
      const time = Date.now() * 0.00005
      zprogress += 1
      zprogress_second += 1

      if (zprogress >= zAxisNumber + depth / 2) {
        zprogress = particles_init_position
      } else {
        particles_first.forEach((item) => {
          item.position.setZ(zprogress)
        })
      }
      if (zprogress_second >= zAxisNumber + depth / 2) {
        zprogress_second = particles_init_position
      } else {
        particles_second.forEach((item) => {
          item.position.setZ(zprogress_second)
        })
      }

      for (let i = 0; i < materials.length; i++) {
        const color = parameters[i][0]

        const h = ((360 * (color[0] + time)) % 360) / 360
        materials[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2)))
      }
    }

    // 初始化云的运动函数
    const initCloudMove = (
      cloudParameter: any,
      speed: number,
      scaleSpeed = 0.0006,
      maxScale = 1,
      startScale = 0
    ) => {
      let cloudProgress = 0
      return () => {
        if (startScale < maxScale) {
          startScale += scaleSpeed
          cloudParameter.cloud.scale.setScalar(startScale)
        }
        if (cloudProgress > 1) {
          cloudProgress = 0
          startScale = 0
        } else {
          cloudProgress += speed
          if (cloudParameter.curve) {
            const point = cloudParameter.curve.getPoint(cloudProgress)
            if (point && point.x) {
              cloudParameter.cloud.position.set(point.x, point.y, point.z)
            }
          }
        }
      }
    }

    //渲染器
    const initRenderer = () => {
      // 开启抗锯齿
      // 在 css 中设置背景色透明显示渐变色
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      // 定义渲染器的尺寸；在这里它会填满整个屏幕
      renderer.setSize(width, height)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(renderer.domElement)
      container.appendChild(stats.dom)
      renderCloudMove_first = initCloudMove(cloudParameter_first, 0.0002)
      renderCloudMove_second = initCloudMove(
        cloudParameter_second,
        0.0008,
        0.001
      )
    }

    //动画刷新
    const animate = () => {
      requestAnimationFrame(animate)
      renderSphereRotate()
      renderStarMove()
      renderCloudMove_first()
      renderCloudMove_second()
      renderer.render(scene, camera)
    }

    // 获取验证码

    // 提交表单

    // 创建渲染器
    // renderer = new THREE.WebGLRenderer({ antialias: true })
    container = containerRef.current
    width = container.clientWidth
    height = container.clientHeight
    initScene()
    initSceneBg()
    initCamera()
    initLight()
    initSphereModal()
    initSphereGroup()
    particles_init_position = -zAxisNumber - depth / 2
    zprogress = particles_init_position
    zprogress_second = particles_init_position * 2
    particles_first = initSceneStar(particles_init_position)
    particles_second = initSceneStar(zprogress_second)
    cloudParameter_first = initTubeRoute(
      [
        new THREE.Vector3(-width / 10, 0, -depth / 2),
        new THREE.Vector3(-width / 4, height / 8, 0),
        new THREE.Vector3(-width / 4, 0, zAxisNumber),
      ],
      400,
      200
    )
    cloudParameter_second = initTubeRoute(
      [
        new THREE.Vector3(width / 8, height / 8, -depth / 2),
        new THREE.Vector3(width / 8, height / 8, zAxisNumber),
      ],
      200,
      100
    )
    // const handleResize = () => {
    //   requestAnimationFrame(animate)
    //   animate()
    // }

    // // 监听窗口尺寸变化
    // window.addEventListener('resize', handleResize)
    initRenderer()
    // 控制器必须放在renderer函数后面
    initOrbitControls()
    animate()

    // 清除资源
    return () => {
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}>
      <div className="login-ground"></div>
    </div>
  )
}

export default ThreeBackground
