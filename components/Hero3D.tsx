'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function Hero3D() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 3)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    let responsiveTargetSize = 1.75
    const setSize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      const minSide = Math.min(w, h)
      // Keep full phone visible on smaller screens.
      responsiveTargetSize = minSide < 420 ? 1.18 : minSide < 560 ? 1.42 : 1.75
      camera.position.z = minSide < 420 ? 3.4 : 3
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    setSize()
    mount.appendChild(renderer.domElement)

    const disposeObject = (obj: THREE.Object3D) => {
      obj.traverse((child) => {
        const anyChild = child as any
        if (anyChild.geometry?.dispose) anyChild.geometry.dispose()
        const mat = anyChild.material
        if (mat) Array.isArray(mat) ? mat.forEach((m) => m?.dispose?.()) : mat?.dispose?.()
      })
    }

    const group = new THREE.Group()
    scene.add(group)

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const dir = new THREE.DirectionalLight(0xffffff, 1.1)
    dir.position.set(2, 2, 2)
    scene.add(dir)

    const loader = new GLTFLoader()
    loader.load(
      '/api/model/iphone-17-pro-max',
      (gltf) => {
        const phone = gltf.scene
        const box = new THREE.Box3().setFromObject(phone)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        phone.scale.setScalar(responsiveTargetSize / maxDim)

        // Recompute bounds after scale and center model for smooth rotation.
        const scaledBox = new THREE.Box3().setFromObject(phone)
        const center = new THREE.Vector3()
        scaledBox.getCenter(center)
        phone.position.sub(center)
        phone.position.y += responsiveTargetSize > 1.6 ? 0.16 : 0.06

        group.add(phone)
      },
      undefined,
      () => {
        setLoadError(true)
      }
    )

    let raf = 0
    const start = performance.now()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = (performance.now() - start) / 1000
      group.rotation.y = t * 0.12 // slow rotation
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => setSize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      disposeObject(group)
      disposeObject(scene)
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-600 bg-background/80">
          Could not load `iphone_17_pro_max.glb`
        </div>
      )}
    </div>
  )
}

